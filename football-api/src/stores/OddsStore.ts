import { action, computed, flow, observable, toJS } from 'mobx';
import { Bet, BetsValue, Fixture, OddsInfo, OddsResponse } from '../core/models/models';
import DataService from '../services/DataService';
import { MainStore } from './MainStore';

export class OddsStore {
	public MainStore: MainStore;
	// public DataService: DataService;

	@observable testOdds: OddsResponse[];
	@observable testFixtures: Fixture[];

	@observable oddsInfos: OddsInfo = new OddsInfo();
	@observable drawInfos = {
		sum: 0,
		drawWhenHomeFavorite: 0,
		drawWhenAwayFavorite: 0,
		drawWhenNoOneFavorite: 0, // 2+ odds mindkettőre
		drawWithGoals: 0,
		drawWithoutGoals: 0
	};

	constructor(MainStore: MainStore) {
		// this.DataService = new DataService();

		this.MainStore = MainStore;
	}

	Init = flow(function* (this: OddsStore) {
		const testOdds = yield require('../data/england_ods.json');
		const testFixtures = yield require('../data/testCurrentFixtures_England2021.json');

		this.testOdds = testOdds.response;
		this.testFixtures = testFixtures.response;
	});

	testFunc = flow(function* (this: OddsStore) {
		const fixtureIds = yield this.getAllFixtureIds;

		yield fixtureIds.map((fixture) => {
			const oddsObj: OddsResponse = this.testOdds.find((item: OddsResponse) => item.fixture.id === fixture);
			const fixtureObj: Fixture = this.testFixtures.find((item: Fixture) => item.fixture.id === fixture);

			const bets: Bet[] = oddsObj.bookmakers[0].bets;
			const mainOdds: BetsValue[] = bets[0].values; // "Match Winners"

			let favorite: 'home' | 'away' = null;
			let favoriteOdd: number = null;

			if (parseFloat(mainOdds[0].odd) < parseFloat(mainOdds[2].odd)) {
				favorite = 'home';
				favoriteOdd = parseFloat(mainOdds[0].odd);
			}
			if (parseFloat(mainOdds[0].odd) > parseFloat(mainOdds[2].odd)) {
				favorite = 'away';
				favoriteOdd = parseFloat(mainOdds[2].odd);
			}

			let winFavorite: boolean = fixtureObj.teams[favorite].winner;

			this.changeOddsInfos(winFavorite, favoriteOdd, favorite);

			if (winFavorite === null) {
				const wasGoal: boolean = fixtureObj.goals.home > 0 ? true : false;

				this.changeDrawInfos(favoriteOdd, favorite, wasGoal);
			}
		});

		console.log(toJS(this.oddsInfos));
	});

	@action changeDrawInfos(favoriteOdd: number, favorite: 'home' | 'away', wasGoal: boolean) {
		this.drawInfos.sum += 1;

		if (favoriteOdd > 2) {
			this.drawInfos.drawWhenNoOneFavorite += 1;
		} else {
			if (favorite === 'home') this.drawInfos.drawWhenHomeFavorite += 1;
			if (favorite === 'away') this.drawInfos.drawWhenAwayFavorite += 1;
		}

		if (wasGoal) {
			this.drawInfos.drawWithGoals += 1;
		} else {
			this.drawInfos.drawWithoutGoals += 1;
		}
	}

	@action changeOddsInfos(winFavorite: boolean, favoriteOdd: number, favorite: 'home' | 'away') {
		//TODO: 2.0
		if (winFavorite) {
			this.oddsInfos.favoriteWin += 1;
		} else {
			this.oddsInfos.unFavoriteWin += 1;
		}

		if (favoriteOdd < 1.5) {
			this.oddsInfos.smallOdd[favorite].sum += 1;

			if (winFavorite === true) this.oddsInfos.smallOdd[favorite].win += 1;
			if (winFavorite === null) this.oddsInfos.smallOdd[favorite].draw += 1;
			if (winFavorite === false) this.oddsInfos.smallOdd[favorite].lose += 1;
		}
		if (favoriteOdd < 1.9 && favoriteOdd > 1.5) {
			this.oddsInfos.midOdd[favorite].sum += 1;

			if (winFavorite === true) this.oddsInfos.midOdd[favorite].win += 1;
			if (winFavorite === null) this.oddsInfos.midOdd[favorite].draw += 1;
			if (winFavorite === false) this.oddsInfos.midOdd[favorite].lose += 1;
		}
		if (favoriteOdd > 1.9) {
			this.oddsInfos.highOdd[favorite].sum += 1;

			if (winFavorite === true) this.oddsInfos.highOdd[favorite].win += 1;
			if (winFavorite === null) this.oddsInfos.highOdd[favorite].draw += 1;
			if (winFavorite === false) this.oddsInfos.highOdd[favorite].lose += 1;
		}

		return;
	}

	@computed get getAllFixtureIds() {
		// return (country) => {
		return this.testOdds.map((oddsPerFix: OddsResponse) => oddsPerFix.fixture.id);
		// }
	}

	//TODO: Odds-ot figyelembe véve
	//? Mennyi meglepetés => nagyobb odds-al rendelkező nyer
	//? 3 kategóriában milyen gyakran jönnek be azok meccsek ahol az odds:
	//? ---> 1 - 1.5
	//? ---> 1.5 - 1.9
	//? ---> 1.9+
	//? Ezeket hazai / vendég viszonlatba is nézni

	//? Ha döntetlen akkor mennyi volt a két odds közötti különbség
	//? Döntetlen úgy hogy a vendégen volt kisebb az odds és akkor mennyi volt
	//? Döntetlen úgy hogy a hazai-n kisebb az odds és úgy mennyi volt

	//? Első félidőbe vezet a nagyobb odds-ú akkor mi lesz a végeredmény / Hazai és Vendég viszonylatban

	//TODO: Mindkét csapat gól
	//? Tényezők amik befolyásolhatják:
	//? Előző 5 meccsen emnnyi gólt lőttek
	//? Otthon vagy idegenben a favorite csapat
	//? Odds különsbég
}

import { action, computed, flow, observable, toJS } from 'mobx';
import { LEAGUES } from '../../../core/constants/constants';
import { Bet, BetsValue, Bookmaker, IOddsMapping } from '../models/models';
import OddsService from '../services/OddsService';
import { MainStore } from '../../../stores/MainStore';
import { Fixture, OddsInfo, OddsResponse } from '../../../core/models/models';

// .response

export class OddsStore {
	public MainStore: MainStore;
	// public OddsService: OddsService;

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
		this.MainStore = MainStore;
	}

	Init = flow(function* (this: OddsStore) {});

	testFunc = flow(function* (this: OddsStore) {
		const fixtureIds = yield this.getAllFixtureIds;

		yield fixtureIds.forEach((fixture) => {
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

	saveOdds = flow(function* (this: MainStore, country: string, all?: boolean) {
		let odds;
		let response;

		// TODO: Backenden kezelni a kéréseket
		if (all) {
			odds = yield OddsService.GetUnibetOdds(LEAGUES.ENGLAND);
			if (odds.response.length < 1) return console.log('Nincs item');
			yield OddsService.saveOdds(odds, 'england');

			odds = yield OddsService.GetUnibetOdds(LEAGUES.ITALY);
			if (odds.response.length < 1) return console.log('Nincs item');
			yield OddsService.saveOdds(odds, 'italy');

			odds = yield OddsService.GetUnibetOdds(LEAGUES.FRANCE);
			if (odds.response.length < 1) return console.log('Nincs item');
			yield OddsService.saveOdds(odds, 'france');

			odds = yield OddsService.GetUnibetOdds(LEAGUES.SPAIN);
			if (odds.response.length < 1) return console.log('Nincs item');
			yield OddsService.saveOdds(odds, 'spain');

			odds = yield OddsService.GetUnibetOdds(LEAGUES.GERMANY);
			if (odds.response.length < 1) return console.log('Nincs item');
			yield OddsService.saveOdds(odds, 'germany');
		}

		switch (country) {
			case 'england':
				odds = yield OddsService.GetUnibetOdds(LEAGUES.ENGLAND);
				break;
			case 'italy':
				odds = yield OddsService.GetUnibetOdds(LEAGUES.ITALY);
				break;
			case 'france':
				odds = yield OddsService.GetUnibetOdds(LEAGUES.FRANCE);
				break;
			case 'spain':
				odds = yield OddsService.GetUnibetOdds(LEAGUES.SPAIN);
				break;
			case 'germany':
				odds = yield OddsService.GetUnibetOdds(LEAGUES.GERMANY);
				break;
		}

		console.log('odds', odds);

		response = yield OddsService.saveOdds(odds, country); // TODO: Backendre átírni constansba a league ID-kat
		console.log('response', response);
	});

	getLeagueOdds = flow(function* (this: MainStore) {
		//! const response = yield OddsService.GetLeagueOdds(LEAGUES.ITALY);
		//! const useData: ILeagueOddsResponse[] = response.response;

		const response: IOddsMapping = yield OddsService.GetAvailableFixtures();
		// TODO Sok ligánál más a season szám valahol 2020, 2021 , 2022 stb // mapping-nél

		console.log('response', response);
	});

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

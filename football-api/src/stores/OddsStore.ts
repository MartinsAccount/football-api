import { action, computed, flow, observable, toJS } from 'mobx';
import { Bet, BetsValue, Fixture, OddsResponse } from '../models/models';
import { DataService } from '../services/DataService';
import { MainStore } from './MainStore';

export class OddsStore {
	public MainStore: MainStore;
	public DataService: DataService;

	@observable testOdds: OddsResponse[];
	@observable testFixtures: Fixture[];

	@observable statistics = {
		favoriteWin: {
			sum: 0,
			smallOdds: 0,
			midOdds: 0,
			highOdds: 0
		},
		unFavoriteWin: 0
	};

	constructor(MainStore: MainStore) {
		this.DataService = new DataService();

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

			// Ha döntetlen akkor winner: null
			let winFavorite: boolean = fixtureObj.teams[favorite].winner === true ? true : false;

			this.changeStatistics(winFavorite, favoriteOdd);
		});

		console.log(toJS(this.statistics));
	});

	@action changeStatistics(winFavorite: boolean, favoriteOdd: number) {
		if (winFavorite) {
			this.statistics.favoriteWin.sum += 1;

			if (favoriteOdd < 1.5) {
				this.statistics.favoriteWin.smallOdds += 1;
			}
			if (favoriteOdd < 1.9 && favoriteOdd > 1.5) {
				this.statistics.favoriteWin.midOdds += 1;
			}
			if (favoriteOdd > 1.9) {
				this.statistics.favoriteWin.highOdds += 1;
			}
		} else {
			this.statistics.unFavoriteWin += 1;
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
}

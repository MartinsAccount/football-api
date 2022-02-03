import { action, computed, flow, observable, toJS } from 'mobx';
import { LEAGUES } from '../../../core/constants/constants';
import { Bet, BetsValue, ILeagueOddsResponse, IOddsMapping, ISavedOdds } from '../models/models';
import OddsService from '../services/OddsService';
import { MainStore } from '../../../stores/MainStore';
import { Fixture, Fixtures, OddsResponse } from '../../../core/models/models';
import { DRAW_INFO, ODDS_INFO } from '../constants/constants';

export class OddsStore {
	public MainStore: MainStore;
	// public OddsService: OddsService;

	@observable testOdds: OddsResponse[];
	@observable testFixtures: Fixture[];

	@observable savedOdds: ISavedOdds;
	@observable currentOdds: keyof ISavedOdds;
	@observable currentFixtures: Fixture[];

	@observable currentLeague: string;

	@observable oddsInfos: typeof ODDS_INFO;
	@observable drawInfos: typeof DRAW_INFO;

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;

		this.oddsInfos = { ...ODDS_INFO };
		this.drawInfos = { ...DRAW_INFO };
	}

	Init = flow(function* (this: OddsStore) {
		// const currentFixtures = yield FixtureService.GetCurrentSeasonFixtures(LEAGUES.SPAIN);
		// console.log(JSON.stringify(currentFixtures));
		// yield this.getSavedOdds();
	});

	getSavedOdds = flow(function* (this: OddsStore) {
		const { response } = yield OddsService.GetSavedOdds();

		this.savedOdds = response;
		console.log('odds', toJS(this.savedOdds));
	});

	@computed get getCurrentOdds(): ILeagueOddsResponse[] {
		if (!this.currentOdds || !this.saveOdds) return [];

		return this.savedOdds[this.currentOdds].odds;
	}

	changeCurrentOddsLeague = flow(function* (this: OddsStore, league: keyof ISavedOdds) {
		this.currentOdds = league;

		let _fixtures: Fixtures;
		let _league: string;

		switch (league) {
			case 'englandOdds':
				_fixtures = yield require('../../../data/allMatchPremierLeague_2021.json');
				_league = 'Angol bajnokság';
				break;
			case 'germanyOdds':
				_fixtures = yield require('../../../data/allMatchBundesliga_2021.json');
				_league = 'Német bajnokság';
				break;
			case 'spainOdds':
				_fixtures = yield require('../../../data/allMatchLaLiga_2021.json');
				_league = 'Spanyol bajnokság';
				break;
			case 'italyOdds':
				_fixtures = yield require('../../../data/allMatchSeriaA_2021.json');
				_league = 'Olasz bajnokság';
				break;
			case 'franceOdds':
				_league = 'Francia bajnokság';
				_fixtures = yield require('../../../data/allMatchFrance_2021.json');
		}

		this.oddsInfos = { ...ODDS_INFO };
		this.drawInfos = { ...DRAW_INFO };

		this.currentFixtures = _fixtures.response;
		this.currentLeague = _league;

		this.analyzeOddsInfos();
	});

	analyzeOddsInfos = flow(function* (this: OddsStore) {
		const fixtureIds = yield this.getAllFixtureIds;

		yield fixtureIds.forEach((fixture: number) => {
			const oddsObj: ILeagueOddsResponse = this.getCurrentOdds.find((item: ILeagueOddsResponse) => item.fixture.id === fixture);
			const fixtureObj: Fixture = this.currentFixtures.find((item: Fixture) => item.fixture.id === fixture);

			const bets: Bet[] = oddsObj.bookmakers[0]?.bets;
			const mainOdds: BetsValue[] = bets[0].values; // "Match Winners"

			let favorite: 'home' | 'away' = null;
			let favoriteOdd: number = null;
			let unFavoriteOdd: number = null;

			if (parseFloat(mainOdds[0].odd) <= parseFloat(mainOdds[2].odd)) {
				favorite = 'home';
				favoriteOdd = parseFloat(mainOdds[0].odd);
				unFavoriteOdd = parseFloat(mainOdds[2].odd);
			}
			if (parseFloat(mainOdds[0].odd) > parseFloat(mainOdds[2].odd)) {
				favorite = 'away';
				favoriteOdd = parseFloat(mainOdds[2].odd);
				unFavoriteOdd = parseFloat(mainOdds[0].odd);
			}

			const winFavorite: boolean = fixtureObj.teams[favorite]?.winner;

			this.changeOddsInfos(favorite, winFavorite, favoriteOdd, unFavoriteOdd);

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
			if (favorite === 'home') this.drawInfos.drawWhenHomeFavorite += 1;
			if (favorite === 'away') this.drawInfos.drawWhenAwayFavorite += 1;
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

	@action changeOddsInfos(favorite: 'home' | 'away', winFavorite: boolean, favoriteOdd: number, unFavoriteOdd?: number) {
		const _oddsInfos = { ...this.oddsInfos };

		let oddSize: 'smallOdd' | 'midOdd' | 'highOdd';

		if (favoriteOdd <= 1.5) oddSize = 'smallOdd';
		if (favoriteOdd <= 1.9 && favoriteOdd > 1.5) oddSize = 'midOdd';
		if (favoriteOdd > 1.9) oddSize = 'highOdd';

		//TODO: 2.0
		_oddsInfos.sum += 1;

		if (winFavorite) {
			_oddsInfos.favoriteWin += 1;
		} else {
			_oddsInfos.unFavoriteWin += 1;
		}

		// change object
		_oddsInfos[oddSize][favorite].sum += 1;

		if (winFavorite === true) _oddsInfos[oddSize][favorite].win += 1;
		if (winFavorite === null) _oddsInfos[oddSize][favorite].draw += 1;
		if (winFavorite === false) _oddsInfos[oddSize][favorite].lose += 1;

		this.oddsInfos = _oddsInfos;
	}

	@computed get homeSmallOdds() {
		return `GY: ${this.oddsInfos.smallOdd.home.win} D: ${this.oddsInfos.smallOdd.home.draw} V: ${this.oddsInfos.smallOdd.home.lose}`;
	}
	@computed get awaySmallOdds() {
		return `GY: ${this.oddsInfos.smallOdd.away.win} D: ${this.oddsInfos.smallOdd.away.draw} V: ${this.oddsInfos.smallOdd.away.lose}`;
	}
	@computed get homeMidOdds() {
		return `GY: ${this.oddsInfos.midOdd.home.win} D: ${this.oddsInfos.midOdd.home.draw} V: ${this.oddsInfos.midOdd.home.lose}`;
	}
	@computed get awayMidOdds() {
		return `GY: ${this.oddsInfos.midOdd.away.win} D: ${this.oddsInfos.midOdd.away.draw} V: ${this.oddsInfos.midOdd.away.lose}`;
	}
	@computed get homeHighOdds() {
		return `GY: ${this.oddsInfos.highOdd.home.win} D: ${this.oddsInfos.highOdd.home.draw} V: ${this.oddsInfos.highOdd.home.lose}`;
	}
	@computed get awayHighOdds() {
		return `GY: ${this.oddsInfos.highOdd.away.win} D: ${this.oddsInfos.highOdd.away.draw} V: ${this.oddsInfos.highOdd.away.lose}`;
	}

	@computed get getAllFixtureIds() {
		return this.getCurrentOdds.map((oddsPerFix: ILeagueOddsResponse) => oddsPerFix.fixture.id);
	}

	saveOdds = flow(function* (this: OddsStore, country: string, all?: boolean) {
		let odds;
		let response;

		this.MainStore.isLoading = true;

		// TODO: Backenden kezelni a kéréseket
		if (country === 'all') {
			this.MainStore.loadingText = 'Angol meccsek mentése...';
			odds = yield OddsService.GetUnibetOdds(LEAGUES.ENGLAND);
			if (odds.response.length < 1) return console.log('Nincs item');
			let englands = yield OddsService.saveOdds(odds, 'england');
			console.log(englands);

			this.MainStore.loadingText = 'Olasz meccsek mentése..';
			odds = yield OddsService.GetUnibetOdds(LEAGUES.ITALY);
			if (odds.response.length < 1) return console.log('Nincs item');
			let italies = yield OddsService.saveOdds(odds, 'italy');
			console.log(italies);

			this.MainStore.loadingText = 'Francia meccsek mentése..';
			odds = yield OddsService.GetUnibetOdds(LEAGUES.FRANCE);
			if (odds.response.length < 1) return console.log('Nincs item');
			let frances = yield OddsService.saveOdds(odds, 'france');
			console.log(frances);

			this.MainStore.loadingText = 'Spanyol meccsek mentése..';
			odds = yield OddsService.GetUnibetOdds(LEAGUES.SPAIN);
			if (odds.response.length < 1) return console.log('Nincs item');
			let spains = yield OddsService.saveOdds(odds, 'spain');
			console.log(spains);

			this.MainStore.loadingText = 'Német meccsek mentése..';
			odds = yield OddsService.GetUnibetOdds(LEAGUES.GERMANY);
			if (odds.response.length < 1) return console.log('Nincs item');
			let germanys = yield OddsService.saveOdds(odds, 'germany');
			console.log(germanys);
		} else {
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
		}

		this.MainStore.isLoading = false;
		console.log('response', response);
	});

	getLeagueOdds = flow(function* (this: OddsStore) {
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

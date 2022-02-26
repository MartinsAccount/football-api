import { action, computed, flow, observable, toJS } from 'mobx';
import { LEAGUES } from '../../../core/constants/constants';
import { IFixtures } from '../models/models';
import { MainStore } from '../../../stores/MainStore';
import { Fixture } from '../../../core/models/models';
import ApiURLs from '../../../services/ApiURLs';
import { Bet, BetsValue, ILeagueOddsResponse, IOdds } from '../models/IOdds';
import { ITableRow } from '../models/ITableRow';
import { ODDS_INFO } from '../constants/oddsInfo';
import { DRAW_INFO } from '../constants/drawInfo';

type ICurruntLeagues = 'england' | 'germany' | 'france' | 'italy' | 'spain' | 'all';

export class OddsStore {
	@observable public MainStore: MainStore;
	// public OddsService: OddsService;
	@observable Odds: IOdds;
	@observable Fixtures: IFixtures;

	@observable oddsInfos: typeof ODDS_INFO;
	@observable drawInfos: typeof DRAW_INFO;

	@observable currentLeague: ICurruntLeagues;

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;

		this.oddsInfos = { ...ODDS_INFO };
		this.drawInfos = { ...DRAW_INFO };
	}

	Init = flow(function* (this: OddsStore) {
		this.MainStore.isLoading = true;

		yield this.loadOdds();
		yield this.loadFixtures();

		this.MainStore.isLoading = false;
	});

	loadOdds = flow(function* (this: OddsStore) {
		const { response } = yield this.MainStore.FetchService.get(ApiURLs.BACKEND.GET_SAVED_ODDS());

		this.Odds = {
			england: response.englandOdds,
			germany: response.germanyOdds,
			spain: response.spainOdds,
			italy: response.italyOdds,
			france: response.franceOdds
		};
		console.log('odds', toJS(this.Odds));
	});

	loadFixtures = flow(function* (this: OddsStore) {
		let { response: england } = yield require('../../../data/allMatchPremierLeague_2021.json');
		let { response: germany } = yield require('../../../data/allMatchBundesliga_2021.json');
		let { response: spain } = yield require('../../../data/allMatchLaLiga_2021.json');
		let { response: italy } = yield require('../../../data/allMatchSeriaA_2021.json');
		let { response: france } = yield require('../../../data/allMatchFrance_2021.json');

		this.Fixtures = {
			england: england,
			germany: germany,
			spain: spain,
			italy: italy,
			france: france
		};
		console.log('fixtures', toJS(this.Fixtures));
	});

	@action changeLeague(league: ICurruntLeagues) {
		this.currentLeague = league;

		this.oddsInfos = { ...ODDS_INFO };
		this.drawInfos = { ...DRAW_INFO };

		this.analyzeOddsInfos();
	}

	analyzeOddsInfos = flow(function* (this: OddsStore) {
		const fixtureIds = yield this.getAllFixtureIds;

		yield fixtureIds.forEach((fixtureId: number) => {
			const oddsObj: ILeagueOddsResponse = this.getCurrentOdds.find((item: ILeagueOddsResponse) => item.fixture.id === fixtureId);
			const fixtureObj: Fixture = this.getCurrentFixtures.find((item: Fixture) => item.fixture.id === fixtureId);

			const bets: Bet[] = oddsObj.bookmakers[0]?.bets;
			const mainOdds: BetsValue[] = bets[0].values; // "Match Winners"

			let favorite: 'home' | 'away' = null;
			let unFavorite: 'home' | 'away' = null;
			let favoriteOdd: number = null;
			let unFavoriteOdd: number = null;

			if (parseFloat(mainOdds[0].odd) <= parseFloat(mainOdds[2].odd)) {
				favorite = 'home';
				unFavorite = 'away';
				favoriteOdd = parseFloat(mainOdds[0].odd);
				unFavoriteOdd = parseFloat(mainOdds[2].odd);
			}
			if (parseFloat(mainOdds[0].odd) > parseFloat(mainOdds[2].odd)) {
				favorite = 'away';
				unFavorite = 'home';
				favoriteOdd = parseFloat(mainOdds[2].odd);
				unFavoriteOdd = parseFloat(mainOdds[0].odd);
			}

			// const winFavorite: boolean = fixtureObj.teams[favorite]?.winner;
			const winFavorite: boolean = +fixtureObj.goals[favorite] > +fixtureObj.goals[unFavorite];
			const isDraw: boolean = +fixtureObj.goals[favorite] === +fixtureObj.goals[unFavorite];
			let winner: 'home' | 'away';
			if (+fixtureObj.goals.home > +fixtureObj.goals.away) winner = 'home';
			if (+fixtureObj.goals.home < +fixtureObj.goals.away) winner = 'away';

			this.changeOddsInfos(favorite, winFavorite, favoriteOdd, isDraw);

			if (favoriteOdd > 2 && unFavoriteOdd > 2) this.changeOverOddsInfos(winner, favoriteOdd, unFavoriteOdd, isDraw);
			if (isDraw) {
				const wasGoal: boolean = !!(fixtureObj.goals.home > 0);

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

	@action changeOverOddsInfos(winner: 'home' | 'away', favoriteOdd: number, unFavoriteOdd: number, isDraw: boolean) {
		const _oddsInfos = { ...this.oddsInfos };

		_oddsInfos.overOdds.bothOver200.sum += 1;
		if (favoriteOdd > 2.25 && unFavoriteOdd > 2.25) _oddsInfos.overOdds.bothOver225.sum += 1;
		if (favoriteOdd > 2.5 && unFavoriteOdd > 2.5) _oddsInfos.overOdds.bothOver250.sum += 1;
		if (favoriteOdd > 2.7 && unFavoriteOdd > 2.7) _oddsInfos.overOdds.bothOver270.sum += 1;

		if (isDraw) {
			_oddsInfos.overOdds.bothOver200.draw += 1;
			if (favoriteOdd > 2.25 && unFavoriteOdd > 2.25) _oddsInfos.overOdds['bothOver225'].draw += 1;
			if (favoriteOdd > 2.5 && unFavoriteOdd > 2.5) _oddsInfos.overOdds['bothOver250'].draw += 1;
			if (favoriteOdd > 2.7 && unFavoriteOdd > 2.7) _oddsInfos.overOdds['bothOver270'].draw += 1;
		} else {
			_oddsInfos.overOdds.bothOver200[winner] += 1;
			if (favoriteOdd > 2.25 && unFavoriteOdd > 2.25) _oddsInfos.overOdds.bothOver225[winner] += 1;
			if (favoriteOdd > 2.5 && unFavoriteOdd > 2.5) _oddsInfos.overOdds.bothOver250[winner] += 1;
			if (favoriteOdd > 2.7 && unFavoriteOdd > 2.7) _oddsInfos.overOdds.bothOver270[winner] += 1;
		}

		this.oddsInfos = _oddsInfos;
	}

	@action changeOddsInfos(favorite: 'home' | 'away', winFavorite: boolean, favoriteOdd: number, isDraw: boolean) {
		const _oddsInfos = { ...this.oddsInfos };

		let oddSize: 'smallOdd' | 'midOdd' | 'highOdd';
		if (favoriteOdd <= 1.5) oddSize = 'smallOdd';
		if (favoriteOdd <= 1.9 && favoriteOdd > 1.5) oddSize = 'midOdd';
		if (favoriteOdd > 1.9) oddSize = 'highOdd';

		_oddsInfos.sum += 1;
		if (winFavorite) {
			_oddsInfos.favoriteWin += 1;
		} else if (isDraw) {
			_oddsInfos.draw += 1;
		} else {
			_oddsInfos.unFavoriteWin += 1;
		}

		// change object
		_oddsInfos[oddSize][favorite].sum += 1;
		if (isDraw) {
			_oddsInfos[oddSize][favorite].draw += 1;
		} else {
			if (winFavorite === true) _oddsInfos[oddSize][favorite].win += 1;
			if (winFavorite === false) _oddsInfos[oddSize][favorite].lose += 1;
		}

		this.oddsInfos = _oddsInfos;
	}

	saveOdds = flow(function* (this: OddsStore, country: string, all?: boolean) {
		this.MainStore.isLoading = true;
		let odds;
		// TODO: Backenden kezelni a kéréseket
		if (country === 'all') {
			this.MainStore.loadingText = 'Angol meccsek mentése...';
			odds = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_UNIBET_ODDS(LEAGUES.ENGLAND));
			if (odds.response.length < 1) return console.log('Nincs item');
			let englands = yield this.MainStore.FetchService.post(ApiURLs.BACKEND.SAVE_ODDS('england'), odds);
			console.log(englands);

			this.MainStore.loadingText = 'Olasz meccsek mentése..';
			odds = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_UNIBET_ODDS(LEAGUES.ITALY));
			if (odds.response.length < 1) return console.log('Nincs item');
			let italies = yield this.MainStore.FetchService.post(ApiURLs.BACKEND.SAVE_ODDS('italy'), odds);
			console.log(italies);

			this.MainStore.loadingText = 'Francia meccsek mentése..';
			odds = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_UNIBET_ODDS(LEAGUES.FRANCE));
			if (odds.response.length < 1) return console.log('Nincs item');
			let frances = yield this.MainStore.FetchService.post(ApiURLs.BACKEND.SAVE_ODDS('france'), odds);
			console.log(frances);

			this.MainStore.loadingText = 'Spanyol meccsek mentése..';
			odds = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_UNIBET_ODDS(LEAGUES.SPAIN));
			if (odds.response.length < 1) return console.log('Nincs item');
			let spains = yield this.MainStore.FetchService.post(ApiURLs.BACKEND.SAVE_ODDS('spain'), odds);
			console.log(spains);

			this.MainStore.loadingText = 'Német meccsek mentése..';
			odds = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_UNIBET_ODDS(LEAGUES.GERMANY));
			if (odds.response.length < 1) return console.log('Nincs item');
			let germanys = yield this.MainStore.FetchService.post(ApiURLs.BACKEND.SAVE_ODDS('germany'), odds);
			console.log(germanys);
		}
		//	response = yield OddsService.saveOdds(odds, country); // TODO: Backendre átírni constansba a league ID-kat
		this.MainStore.isLoading = false;
	});

	getRandomFixtures = (n: number) => {
		const arr = [];
		let random = arr.sort(() => 0.5 - Math.random()).slice(0, n);

		return random;
	};

	@computed get getAllFixtureIds() {
		return this.getCurrentOdds.map((oddsPerFix: ILeagueOddsResponse) => oddsPerFix.fixture.id);
	}

	@computed get getCurrentOdds(): ILeagueOddsResponse[] {
		if (!this.currentLeague || !this.Odds) return [];

		if (this.currentLeague === 'all') {
			return this.getAllOdds;
		}

		return this.Odds[this.currentLeague].odds;
	}

	@computed get getCurrentFixtures(): Fixture[] {
		if (!this.currentLeague || !this.Fixtures) return [];

		if (this.currentLeague === 'all') {
			return this.getAllFixtures;
		}

		return this.Fixtures[this.currentLeague];
	}

	@computed get getAllFixtures(): Fixture[] {
		if (!this.currentLeague || !this.Fixtures) return [];

		let allFixtures = [];
		for (let item of Object.values(this.Fixtures)) {
			allFixtures.push(toJS(item));
		}

		return allFixtures.flat();
	}

	@computed get getAllOdds(): ILeagueOddsResponse[] {
		if (!this.currentLeague || !this.Odds) return [];

		let allOdds = [];
		for (let item of Object.values(this.Odds)) {
			allOdds.push(toJS(item.odds));
		}

		return allOdds.flat();
	}

	@computed get getTableRows() {
		let arr = ['smallOdd', 'midOdd', 'highOdd'];
		let titles = ['Hazai 1,5 alatt', 'Hazai 1,5 - 1,9 között', 'Hazai 1,9 felett'];
		let both = ['bothOver200', 'bothOver225', 'bothOver250', 'bothOver270'];
		let diff = ['Differencia 0 - 0,5', 'Differencia 0,5 - 1', 'Differencia 1 - 1,5'];

		const rows: ITableRow[] = [
			{ title: 'Esélyesebb nyert', data: this.oddsInfos.favoriteWin, onCustomData: this.oddsInfos.sum },
			{ title: 'Esélytelenebb nyert', data: this.oddsInfos.unFavoriteWin, onCustomData: this.oddsInfos.sum },
			{ title: 'Döntetlen', data: this.oddsInfos.draw, onCustomData: this.oddsInfos.sum },
			...arr.map((it, index) => {
				return {
					title: titles[index],
					GY: this.oddsInfos[it].home.win,
					D: this.oddsInfos[it].home.draw,
					V: this.oddsInfos[it].home.lose,
					onCustomData: this.oddsInfos[it].home.sum
				};
			}),
			...arr.map((it, index) => {
				return {
					title: titles[index].replace('Hazai', 'Vendég'),
					GY: this.oddsInfos[it].away.win,
					D: this.oddsInfos[it].away.draw,
					V: this.oddsInfos[it].away.lose,
					onCustomData: this.oddsInfos[it].away.sum
				};
			}),
			...both.map((it, index) => {
				return {
					title: `Mindkető ${it[8]},${it[9]} felett (H-D-V)`,
					GY: this.oddsInfos.overOdds[it].home,
					D: this.oddsInfos.overOdds[it].draw,
					V: this.oddsInfos.overOdds[it].away,
					onCustomData: this.oddsInfos.overOdds[it].sum
				};
			}),
			{ title: 'Döntetlen (hazai az esélyesebb)', data: this.drawInfos.drawWhenHomeFavorite, onCustomData: this.drawInfos.sum },
			{ title: 'Döntetlen (vendég az esélyesebb)', data: this.drawInfos.drawWhenAwayFavorite, onCustomData: this.drawInfos.sum },
			{
				title: 'Döntetlen (mindkettő 2-es odds felett)',
				data: this.drawInfos.drawWhenNoOneFavorite,
				onCustomData: this.drawInfos.sum
			}
		];

		return rows;
	}

	//TODO: Odds-ot figyelembe véve
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

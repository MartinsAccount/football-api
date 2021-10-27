import { action, computed, flow, observable, toJS } from 'mobx';
import { BETS_TYPES } from '../core/constants/constants';
import { Bet, BetsNames, BetsValue, Bookmaker, Fixture, OddsInfo, OddsResponse } from '../core/models/models';
import DataService from '../services/DataService';
import { MainStore } from './MainStore';
import { ILeagueOddsResponse, IOddsMapping, IOddsMappingResponse } from './OddsStore';

interface IHighestOdds {
	name: string;
	bookmaker: string;
	odd: number;
}
interface IAnalyzedResult {
	// betType: BetsNames;
	highestOdds: IHighestOdds[];
	arbitrage: number;
	// betType: BetsNames
}
interface IAnalyzedElement {
	// betType: BetsNames;
	[key: string]: IAnalyzedResult;
}
export interface IArbitrage {
	homeTeam?: string;
	awayTeam?: string;
	fixture: number;
	country: string;
	date: string;
	analyzed: IAnalyzedElement[];
	matchWinner?: IAnalyzedResult;
	homeAway?: IAnalyzedResult;
}
export class ArbitrageStore {
	public MainStore: MainStore;

	@observable testOdds: OddsResponse[];
	@observable testFixtures: Fixture[];

	@observable Arbitrages: IArbitrage[] = [];
	@observable testArbitrage: IArbitrage[] = [];

	@observable nextPage: number = null;
	@observable totalPage: number = null;

	@observable filtering = null;
	@observable filetBookmakers = null;

	@observable allLeaguesId: Array<number> = [];

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;
	}
	// Init = flow(function* (this: ArbitrageStore) {
	// 	const testFixtures = yield require('../data/testCurrentFixtures_England2021.json');
	// 	this.testFixtures = testFixtures.response;
	// });

	getAvailableFixtures = flow(function* (this: ArbitrageStore) {
		const response = yield DataService.GetAvailableFixtures();

		console.log(response);
	});

	selectAllLeaguesId = flow(function* (this: ArbitrageStore, nextPage: number = 1) {
		const mapping: IOddsMapping = yield DataService.GetAvailableFixtures(nextPage);
		const mappingResponse: IOddsMappingResponse[] = mapping.response;

		const dateNow = Date.parse(new Date().toDateString());

		yield mappingResponse.forEach((item: IOddsMappingResponse) => {
			const fixtureDate = Date.parse(item.fixture.date);

			// jelenlegi időpontnál későbbi meccs
			if (Number(dateNow) - Number(fixtureDate) < 0) {
				if (!this.allLeaguesId.includes(item.league.id)) {
					this.allLeaguesId = [...this.allLeaguesId, item.league.id];
				}
			}
		});

		if (!this.totalPage) this.totalPage = mapping.paging.total;
		this.nextPage = mapping.paging.current + 1;

		// if (this.nextPage <= this.totalPage) {
		// 	yield this.selectAllLeaguesId(this.nextPage);
		// }
		//! Ez csak teszt szám
		if (this.nextPage <= 2) {
			yield this.selectAllLeaguesId(this.nextPage);
		}

		console.log('mapping id-s', toJS(this.allLeaguesId));

		return;
	});

	@computed get getFilteredArbitrages() {
		return [];
	}

	//TODO: Arbrigate calc
	//TODO: Minden fogadóirodánál megkeresni a legnagyobb oddsot (H, D, V) esetekre
	getHighestOdds = flow(function* (this: ArbitrageStore, leagueId?: number) {
		// Összes különöböző league id-t összegyűjti
		yield this.selectAllLeaguesId();

		// const bookmakers = yield DataService.GetHighestOdds();
		for (let index = 0; index < this.allLeaguesId.length; index++) {
			// if (index > 1) return;

			const dateNow = Date.parse(new Date().toDateString());

			const leagueId = this.allLeaguesId[index];

			const { response } = yield DataService.GetLeagueOdds(leagueId);
			const leaguesOdds: ILeagueOddsResponse[] = response;
			console.log('leaguesOdds', leaguesOdds);

			for (let index = 0; index < leaguesOdds.length; index++) {
				const currentFixture = leaguesOdds[index].fixture.id;
				const currentFixtureDate = leaguesOdds[index].fixture.date;
				const currentLeagueCountry = leaguesOdds[index].league.country;

				const fixtureDate = Date.parse(leaguesOdds[index].fixture.date);

				console.log('bookmakers', leaguesOdds[index].bookmakers);

				if (Number(dateNow) - Number(fixtureDate) > 0) continue; //! már lejátszott meccs akkor tovább ugrik
				if (leaguesOdds[index].bookmakers.length < 1) continue; //! ha nincs bookmaker akkor tovább

				// const bookmakersArray = currentFixtureOdds.response[0].bookmakers || [];
				// console.log('bookmakersArray', bookmakersArray);
				const bookmakersArray: Bookmaker[] = leaguesOdds[index].bookmakers || [];

				const MATCH_WINNER_ARBITRAGE = yield this.analyzeBookmaker(bookmakersArray, 'Match Winner');
				const HOME_AWAY_ARBITRAGE = yield this.analyzeBookmaker(bookmakersArray, 'Home/Away');

				let arbitrageObj = {
					fixture: currentFixture,
					date: currentFixtureDate,
					country: currentLeagueCountry,
					analyzed: { ...MATCH_WINNER_ARBITRAGE, ...HOME_AWAY_ARBITRAGE },
					matchWinner: MATCH_WINNER_ARBITRAGE,
					homeAway: HOME_AWAY_ARBITRAGE
				};

				this.Arbitrages.push(arbitrageObj);

				console.log('----------Arbitrage number----------', toJS(this.Arbitrages));
				console.log(
					`
			FINISHED 
			`
				);
			}
		}
	});

	analyzeBookmaker = (bookmakers: Bookmaker[], betType: BetsNames) => {
		let result: IAnalyzedResult = {
			highestOdds: null,
			arbitrage: null
			// resultName: null // TODO: hogy melyik fogadáshoz tartozik betType: "matchWinner" pl
		};

		let twoParamsStructure = [
			{ name: '', bookmaker: '', odd: 0 },
			{ name: '', bookmaker: '', odd: 0 }
		];
		let threeParamsStructure = [
			{ name: '', bookmaker: '', odd: 0 },
			{ name: '', bookmaker: '', odd: 0 },
			{ name: '', bookmaker: '', odd: 0 }
		];

		let matchWinner = [
			{ name: 'highestHome', bookmaker: '', odd: 0 },
			{ name: 'highestDraw', bookmaker: '', odd: 0 },
			{ name: 'highestAway', bookmaker: '', odd: 0 }
		];
		let firstHalfWinner = [
			{ name: 'highestHome', bookmaker: '', odd: 0 },
			{ name: 'highestDraw', bookmaker: '', odd: 0 },
			{ name: 'highestAway', bookmaker: '', odd: 0 }
		];
		let secondHalfWinner = [
			{ name: 'highestHome', bookmaker: '', odd: 0 },
			{ name: 'highestDraw', bookmaker: '', odd: 0 },
			{ name: 'highestAway', bookmaker: '', odd: 0 }
		];
		let goalsOverUnder = [];
		let bothTeamGoal = [];
		let homeAway = [
			{ name: 'highestHome', bookmaker: '', odd: 0 },
			{ name: 'highestAway', bookmaker: '', odd: 0 }
		];

		let tesStructure = [
			{
				bet: 'matchWinner',
				values: []
			},
			{
				bet: 'homeAway',
				values: []
			}
		];

		let newArray = [];

		let twoParams = ['homeAway', 'bothTeamsGoal'];
		let threeParams = ['matchWinner', 'firstHalfWinner', 'secondHalfWinner'];

		bookmakers.forEach((bookmaker) => {
			const selectedBet = bookmaker.bets.find((bet: Bet) => bet.name === betType);
			if (!selectedBet) return;

			//? NEW
			// let changedObjectName = null;
			// switch (betType) {
			// 	case BETS_TYPES.Vegeredmeny:
			// 		changedObjectName = 'matchWinner';
			// 		break;
			// 	case BETS_TYPES.HazaiVagyVendeg:
			// 		changedObjectName = 'homeAway';
			// 		break;
			// 	case BETS_TYPES.ElsoFelidoVegeredmeny:
			// 		changedObjectName = 'firstHalfWinner';
			// 		break;
			// 	case BETS_TYPES.MasodikFelidoVegeredmeny:
			// 		changedObjectName = 'secondHalfWinner';
			// 		break;
			// 	case BETS_TYPES.MindketCsapatGol:
			// 		changedObjectName = 'bothTeamsGoal';
			// 		break;
			// 	case BETS_TYPES.GolokSzama:
			// 		console.log('Gól több vagy kevesebb', selectedBet);
			// 		break;
			// }

			// result.resultName = changedObjectName

			// if (twoParams.includes(changedObjectName)) newArray = [...twoParamsStructure];
			// if (threeParams.includes(changedObjectName)) newArray = [...threeParamsStructure];

			// //? NEW
			// selectedBet.values?.forEach((item: BetsValue, index) => {
			// 	if (Number(item.odd) > newArray[index].odd) {
			// 		newArray[index].name = Number(item.value);
			// 		newArray[index].odd = Number(item.odd);
			// 		newArray[index].bookmaker = bookmaker.name;
			// 	}
			// });

			switch (betType) {
				case BETS_TYPES.Vegeredmeny:
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > matchWinner[index].odd) {
							matchWinner[index].odd = Number(item.odd);
							matchWinner[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.HazaiVagyVendeg:
					//TODO:  values undefined hiba
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > homeAway[index].odd) {
							homeAway[index].odd = Number(item.odd);
							homeAway[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.ElsoFelidoVegeredmeny:
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > firstHalfWinner[index].odd) {
							firstHalfWinner[index].odd = Number(item.odd);
							firstHalfWinner[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.MasodikFelidoVegeredmeny:
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > secondHalfWinner[index].odd) {
							secondHalfWinner[index].odd = Number(item.odd);
							secondHalfWinner[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.MindketCsapatGol:
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > bothTeamGoal[index].odd) {
							bothTeamGoal[index].odd = Number(item.odd);
							bothTeamGoal[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.GolokSzama:
					console.log('Gól több vagy kevesebb', selectedBet);
			}
		});

		// //? NEW
		// newArray.forEach((item) => {
		// 	result.arbitrage += 1 / Number(item.odd);
		// });

		// result.highestOdds = newArray;

		switch (betType) {
			case BETS_TYPES.Vegeredmeny:
				matchWinner.forEach((item) => {
					result.arbitrage += 1 / Number(item.odd);
				});
				result.highestOdds = matchWinner;
				break;
			case BETS_TYPES.HazaiVagyVendeg:
				homeAway.forEach((item) => {
					result.arbitrage += 1 / Number(item.odd);
				});
				result.highestOdds = homeAway;
				break;
		}

		console.log(result);

		return result;
	};

	// @action arbitrageCalculator(odd1: number, odd2: number, _stake1: number, _stake2?: number) {
	// 	let bool = false;

	// 	let win1 = 0;
	// 	let win2 = 0;

	// 	let stake1 = _stake1;
	// 	let stake2 = _stake2 || _stake1 / 2;

	// 	win1 = odd1 * stake1;
	// 	win2 = odd2 * stake2;

	// 	let sumWin = win1 + win2;
	// 	let sumStake = stake1 + stake2;

	// 	if (bool) {
	// 		for (let i = 0; i < 20; i++) {}
	// 	}

	// 	if (sumStake < sumWin) {
	// 		let profit1 = win1 - sumStake;
	// 		let profit2 = win2 - sumStake;

	// 		if (Math.abs(profit1 - profit2) > 400) {
	// 			const newStake = stake2 + 200;

	// 			this.arbitrageCalculator(odd1, odd2, stake1, newStake);
	// 		}
	// 	}
	// }
}

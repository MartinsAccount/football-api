import { computed, flow, observable, toJS } from 'mobx';
import { BETS_TYPES } from '../../../core/constants/constants';
import { Bet, BetsValue, Bookmaker } from '../../../core/models/models';
import { IAnalyzedResult, IArbitrage, IHighestOdds } from '../models/models';
import { ILeagueOddsResponse, IOddsMapping, IOddsMappingResponse } from '../../OddsPage/models/models';
import { MainStore } from '../../../stores/MainStore';
import ArbitrageService from '../services/ArbitrageService';

export class ArbitrageStore {
	public MainStore: MainStore;

	@observable fetchNumber: number = 0;

	//* Legfontosabb, (egy meccs kártya az object)
	@observable Arbitrages: IArbitrage[] = [];

	@observable nextPage: number = null;
	@observable totalPage: number = null;

	@observable filtering = null;

	@observable allLeaguesId: Array<number> = [];
	@observable hasAllId: boolean = false;

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;
	}
	// Init = flow(function* (this: ArbitrageStore) {
	// });

	// Összes különöböző league id-t összegyűjti az elérhető meccsek alapján
	selectAllLeaguesId = flow(function* (this: ArbitrageStore, nextPage: number = 1) {
		this.MainStore.isLoading = true;
		this.MainStore.loadingText = `League ID-k összegyűjtése => ${nextPage}/${this?.totalPage} oldal`;

		const mapping: IOddsMapping = yield ArbitrageService.GetAvailableFixtures(nextPage);
		const mappingResponse: IOddsMappingResponse[] = mapping.response;
		//! fetch
		this.fetchNumber += 1;

		const dateNow = Date.parse(new Date().toDateString()); // 1643842800000

		yield mappingResponse.forEach((item: IOddsMappingResponse) => {
			const fixtureDate = Date.parse(item.fixture.date);

			// jelenlegi időpontnál későbbi meccs
			if (Number(dateNow) - Number(fixtureDate) < 0) {
				if (!this.allLeaguesId.includes(item.league.id)) {
					this.allLeaguesId = [...this.allLeaguesId, item.league.id];
				}
			}
		});

		if (!this.totalPage) {
			this.totalPage = mapping.paging.total;
			console.log('ellenőrzéshez_totalPage:', this.totalPage);
		}

		this.nextPage = mapping.paging.current + 1;

		//! Ez csak teszt szám
		// if (this.nextPage <= 2) {
		// 	yield this.selectAllLeaguesId(this.nextPage);
		// }

		// console.log('ellenőrzéshez_from mapping all mappingresponse:', toJS(mappingResponse));
		// console.log('ellenőrzéshez_from mapping all leagues id-s:', toJS(this.allLeaguesId));

		yield this.helperAllLeaguesId();

		return;
	});

	helperAllLeaguesId = flow(function* (this: ArbitrageStore) {
		if (this.nextPage < this.totalPage && this.fetchNumber % 10 !== 0) {
			yield this.selectAllLeaguesId(this.nextPage);
			return;
		}
		if (this.nextPage < this.totalPage && this.fetchNumber % 10 === 0) {
			this.MainStore.loadingText = '60 másodperc szünet';
			yield this.timeoutAllLeaguesId(62000); // 62 sec
			return;
		}
		if (this.nextPage === this.totalPage) {
			this.hasAllId = true;
		}
		if (this.hasAllId) {
			console.log('FOLYAMAT VÉGE! /All leagues Id/:', toJS(this.allLeaguesId));
			yield this.helperHighestOdds();
		}
	});

	timeoutAllLeaguesId(ms): Promise<NodeJS.Timeout> {
		return new Promise((resolve) => setTimeout(() => resolve(this.selectAllLeaguesId(this.nextPage)), ms));
	}

	helperHighestOdds = flow(function* (this: ArbitrageStore) {
		console.log('FOLYAMAT KEZDETE! /getHighestOdds/');

		let leaguesIds = [...this.allLeaguesId];
		let loopLength = Math.round(this.allLeaguesId.length / 9) + 1;

		//TODO: Le kell tesztelni - mehet 10-ig és 60 sec-el?
		for (let i = 0; i < loopLength; i++) {
			this.MainStore.loadingText = `Arbitrage elemzés... ${i * 9}/${leaguesIds.length}`;
			if (i * 9 > leaguesIds.length) this.MainStore.isLoading = false;

			let limitedArr = leaguesIds.slice(i * 9, (i + 1) * 9);

			if (limitedArr.length > 0) yield this.timeoutHighestOdds(62000, limitedArr); // 62 sec
		}
	});

	timeoutHighestOdds(ms: number, arr: Array<number>): Promise<unknown> {
		return new Promise((resolve) => setTimeout(() => resolve(this.getHighestOdds(arr)), ms));
	}

	//TODO: Minden fogadóirodánál megkeresni a legnagyobb oddsot (H, D, V) esetekre
	getHighestOdds = flow(function* (this: ArbitrageStore, leagueIds: Array<number>) {
		// const bookmakers = yield ArbitrageService.GetHighestOdds();
		for (let index = 0; index < leagueIds.length; index++) {
			const dateNow = Date.parse(new Date().toDateString());

			const leagueId = leagueIds[index];
			console.log('ellenőrzéshez_éles league id-k', leagueId);

			const { response } = yield ArbitrageService.GetLeagueOdds(leagueId);
			//! fetch
			this.fetchNumber += 1;

			const leaguesOdds: ILeagueOddsResponse[] = response;
			console.log('ellenőrzéshez_leaguesOdds:', leaguesOdds);

			for (let index = 0; index < leaguesOdds.length; index++) {
				const currentFixture = leaguesOdds[index].fixture.id;
				const currentFixtureDate = leaguesOdds[index].fixture?.date || 'nincs dátum';
				const currentLeagueCountry = leaguesOdds[index].league?.country || 'nincs ország';
				const currentLeagueName = leaguesOdds[index].league?.name || 'nincs név';

				const fixtureDate = Date.parse(leaguesOdds[index].fixture?.date);

				console.log('bookmakers', leaguesOdds[index].bookmakers);

				if (Number(dateNow) - Number(fixtureDate) > 0) continue; //! már lejátszott meccs akkor tovább ugrik
				if (leaguesOdds[index].bookmakers.length < 1) continue; //! ha nincs bookmaker akkor tovább

				// console.log('bookmakersArray', bookmakersArray);
				const bookmakersArray: Bookmaker[] = leaguesOdds[index]?.bookmakers || [];

				//? New:
				const CALCULATE_ARBITRAGE: BETS_TYPES[] = [BETS_TYPES.Vegeredmeny, BETS_TYPES.HazaiVagyVendeg];
				const CALCULATED_ARBITRAGE: IAnalyzedResult[] = [];

				for (let bet of CALCULATE_ARBITRAGE) {
					const result = yield this.analyzeBookmaker(bookmakersArray, bet);

					CALCULATED_ARBITRAGE.push(result);
				}
				//? New:

				const MATCH_WINNER_ARBITRAGE = yield this.analyzeBookmaker(bookmakersArray, BETS_TYPES.Vegeredmeny);
				const HOME_AWAY_ARBITRAGE = yield this.analyzeBookmaker(bookmakersArray, BETS_TYPES.HazaiVagyVendeg);

				let arbitrageObj: IArbitrage = {
					fixture: currentFixture,
					date: currentFixtureDate,
					country: currentLeagueCountry,
					leagueName: currentLeagueName,
					// analyzed: [MATCH_WINNER_ARBITRAGE, HOME_AWAY_ARBITRAGE]
					analyzed: [...CALCULATED_ARBITRAGE] //? New
					// matchWinner: MATCH_WINNER_ARBITRAGE,
					// homeAway: HOME_AWAY_ARBITRAGE
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

	analyzeBookmaker = (bookmakers: Bookmaker[], betType: BETS_TYPES): IAnalyzedResult => {
		let result: IAnalyzedResult = {
			highestOdds: null,
			arbitrage: null,
			name: betType
		};
		//? twoParams
		const { MindketCsapatGol, HazaiVagyVendeg } = BETS_TYPES;
		const twoParams = [HazaiVagyVendeg, MindketCsapatGol, 222];
		//? threeParams
		const { Vegeredmeny, ElsoFelidoVegeredmeny, MasodikFelidoVegeredmeny } = BETS_TYPES;
		const threeParams = [Vegeredmeny, ElsoFelidoVegeredmeny, MasodikFelidoVegeredmeny];

		let twoParamsStructure: IHighestOdds[] = [
			{ name: 'highestHome', bookmaker: '', odd: 0 },
			{ name: 'highestAway', bookmaker: '', odd: 0 }
		];
		let threeParamsStructure: IHighestOdds[] = [
			{ name: 'highestHome', bookmaker: '', odd: 0 },
			{ name: 'highestDraw', bookmaker: '', odd: 0 },
			{ name: 'highestAway', bookmaker: '', odd: 0 }
		];

		bookmakers.forEach((bookmaker: Bookmaker) => {
			const selectedBet = bookmaker.bets.find((bet: Bet) => bet.name === betType);
			if (!selectedBet) return;

			//? NEW
			if (twoParams.includes(betType)) {
				selectedBet.values?.forEach((item: BetsValue, index) => {
					if (Number(item.odd) > twoParamsStructure[index].odd) {
						twoParamsStructure[index].odd = Number(item.odd);
						twoParamsStructure[index].bookmaker = bookmaker.name;
					}
				});
				return;
			}
			if (threeParams.includes(betType)) {
				selectedBet.values?.forEach((item: BetsValue, index) => {
					if (Number(item.odd) > threeParamsStructure[index].odd) {
						threeParamsStructure[index].odd = Number(item.odd);
						threeParamsStructure[index].bookmaker = bookmaker.name;
					}
				});
				return;
			}
			// switch (betType) {
			// 	case BETS_TYPES.Vegeredmeny:
			// 		//? New matchWinner --> threeParamsStructure
			// 		selectedBet.values?.forEach((item: BetsValue, index) => {
			// 			if (Number(item.odd) > threeParamsStructure[index].odd) {
			// 				threeParamsStructure[index].odd = Number(item.odd);
			// 				threeParamsStructure[index].bookmaker = bookmaker.name;
			// 			}
			// 		});
			// 		break;
			// 	case BETS_TYPES.HazaiVagyVendeg:
			// 		//TODO:  values undefined hiba
			// 		//? New homeAway --> twoParamsStructure
			// 		selectedBet.values?.forEach((item: BetsValue, index) => {
			// 			if (Number(item.odd) > twoParamsStructure[index].odd) {
			// 				twoParamsStructure[index].odd = Number(item.odd);
			// 				twoParamsStructure[index].bookmaker = bookmaker.name;
			// 			}
			// 		});
			// 		break;
			// 	case BETS_TYPES.ElsoFelidoVegeredmeny:
			// 		selectedBet.values?.forEach((item: BetsValue, index) => {
			// 			if (Number(item.odd) > threeParamsStructure[index].odd) {
			// 				threeParamsStructure[index].odd = Number(item.odd);
			// 				threeParamsStructure[index].bookmaker = bookmaker.name;
			// 			}
			// 		});
			// 		break;
			// 	case BETS_TYPES.MasodikFelidoVegeredmeny:
			// 		selectedBet.values?.forEach((item: BetsValue, index) => {
			// 			if (Number(item.odd) > threeParamsStructure[index].odd) {
			// 				threeParamsStructure[index].odd = Number(item.odd);
			// 				threeParamsStructure[index].bookmaker = bookmaker.name;
			// 			}
			// 		});
			// 		break;
			// 	case BETS_TYPES.MindketCsapatGol:
			// 		selectedBet.values?.forEach((item: BetsValue, index) => {
			// 			if (Number(item.odd) > twoParamsStructure[index].odd) {
			// 				twoParamsStructure[index].odd = Number(item.odd);
			// 				twoParamsStructure[index].bookmaker = bookmaker.name;
			// 			}
			// 		});
			// 		break;
			// 	case BETS_TYPES.GolokSzama:
			// 		console.log('Gól több vagy kevesebb', selectedBet);
			// }
		});

		//? NEW
		if (twoParams.includes(betType)) {
			twoParamsStructure.forEach((item: IHighestOdds) => {
				result.arbitrage += 1 / Number(item.odd);
			});
			result.highestOdds = twoParamsStructure;
		}
		if (threeParams.includes(betType)) {
			threeParamsStructure.forEach((item: IHighestOdds) => {
				result.arbitrage += 1 / Number(item.odd);
			});
			result.highestOdds = threeParamsStructure;
		}

		// switch (betType) {
		// 	case BETS_TYPES.Vegeredmeny:
		// 		threeParamsStructure.forEach((item) => {
		// 			result.arbitrage += 1 / Number(item.odd);
		// 		});
		// 		result.highestOdds = threeParamsStructure;
		// 		break;
		// 	case BETS_TYPES.HazaiVagyVendeg:
		// 		twoParamsStructure.forEach((item) => {
		// 			result.arbitrage += 1 / Number(item.odd);
		// 		});
		// 		result.highestOdds = twoParamsStructure;
		// 		break;
		// }

		result.arbitrage = result.arbitrage.toFixed(3) as any;

		console.log('result', result);

		return result;
	};

	@computed get getFilteredArbitrages() {
		if (this.filtering === 'goodArbitrage') {
			// return this.Arbitrages.filter((it) => it.analyzed.some(item) => item.arbitrage < 0)
		}
		return [];
	}
}

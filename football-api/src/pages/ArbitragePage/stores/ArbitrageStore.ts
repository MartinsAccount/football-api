import { computed, flow, observable, toJS } from 'mobx';
import { BETS_TYPES } from '../../../core/constants/constants';
import { Bet, BetsNames, BetsValue, Bookmaker, Fixture, OddsResponse } from '../../../core/models/models';
import ArbitrageService from '../services/ArbitrageService';
import { MainStore } from '../../../stores/MainStore';
import { ILeagueOddsResponse, IOddsMapping, IOddsMappingResponse } from '../../OddsPage/models/models';
import { IAnalyzedResult, IArbitrage } from '../models/models';

export class ArbitrageStore {
	public MainStore: MainStore;
	@observable fetchNumber: number = 0;

	@observable testOdds: OddsResponse[];
	@observable testFixtures: Fixture[];

	//* Legfontosabb, (egy meccs kártya az object)
	@observable Arbitrages: IArbitrage[] = [];
	@observable testArbitrage: IArbitrage[] = [];

	@observable nextPage: number = null;
	@observable totalPage: number = null;

	@observable filtering = null;
	@observable filetBookmakers = null;

	@observable allLeaguesId: Array<number> = [];

	@observable numberForAsyncTest: number = 0;
	@observable maxNumberForAsyncTest: number = 30;

	@observable actualFetchNumber: number = 0;
	@observable hasAllId: boolean = false;
	@observable finished: boolean = false;

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;
	}
	// Init = flow(function* (this: ArbitrageStore) {
	// 	const testFixtures = yield require('../data/testCurrentFixtures_England2021.json');
	// 	this.testFixtures = testFixtures.response;
	// });

	getAvailableFixtures = flow(function* (this: ArbitrageStore) {
		const response = yield ArbitrageService.GetAvailableFixtures();

		console.log(response);
	});

	//TODO MŰKÖDIK!
	otherFunc(ms) {
		return new Promise((resolve) => setTimeout(() => resolve(this.AwaitSetTimemout()), ms));
	}

	AwaitSetTimemout = flow(function* (this: ArbitrageStore, start?: boolean) {
		this.actualFetchNumber += 1;
		this.numberForAsyncTest += 1;

		yield this.AsyncTest();

		return;
	});
	AsyncTest = flow(function* (this: ArbitrageStore) {
		console.log('FOLYAMAT KEZDETE!');

		// TODO: MŰKÖDIK
		if (this.numberForAsyncTest < this.maxNumberForAsyncTest && this.actualFetchNumber % 9 !== 0) {
			yield this.AwaitSetTimemout();
			return;
		}
		if (this.numberForAsyncTest < this.maxNumberForAsyncTest && this.actualFetchNumber % 9 === 0) {
			yield this.otherFunc(7000);
			return;
		}
		if (this.numberForAsyncTest === this.maxNumberForAsyncTest) {
			this.hasAllId = true;
		}
		if (this.hasAllId) {
			console.log('FOLYAMAT VÉGE!');
		}
	});

	timeoutAllLeaguesId(ms) {
		return new Promise((resolve) => setTimeout(() => resolve(this.selectAllLeaguesId(this.nextPage)), ms));
	}
	helperAllLeaguesId = flow(function* (this: ArbitrageStore) {
		if (this.nextPage < this.totalPage && this.fetchNumber % 9 !== 0) {
			yield this.selectAllLeaguesId(this.nextPage);
			return;
		}
		if (this.nextPage < this.totalPage && this.fetchNumber % 9 === 0) {
			yield this.timeoutAllLeaguesId(70000); // 70 sec
			return;
		}
		if (this.nextPage === this.totalPage) {
			this.hasAllId = true;
		}
		if (this.hasAllId) {
			console.log('FOLYAMAT VÉGE! /All leagues Id/', toJS(this.allLeaguesId));
			yield this.helperHighestOdds();
		}
	});

	timeoutHighestOdds(ms: number, arr: Array<number>) {
		return new Promise((resolve) => setTimeout(() => resolve(this.getHighestOdds(arr)), ms));
	}
	helperHighestOdds = flow(function* (this: ArbitrageStore) {
		console.log('FOLYAMAT KEZDETE! /getHighestOdds/');

		let leaguesIds = [...this.allLeaguesId];
		let first = leaguesIds.slice(0, 9);
		let second = leaguesIds.slice(9, 18);
		let third = leaguesIds.slice(18, 27);
		let fourth = leaguesIds.slice(27, 36);
		let fifth = leaguesIds.slice(36, 45);
		let sixth = leaguesIds.slice(45, 54);

		let loopLength = Math.round(this.allLeaguesId.length / 9) + 1;

		if (first.length > 0) yield this.timeoutHighestOdds(70000, first); // 70 sec
		if (second.length > 0) yield this.timeoutHighestOdds(140000, second); // 140 sec
		if (third.length > 0) yield this.timeoutHighestOdds(210000, third); // 210 sec
		if (fourth.length > 0) yield this.timeoutHighestOdds(280000, fourth); // 280 sec
		if (fifth.length > 0) yield this.timeoutHighestOdds(350000, fifth); // 350 sec
		if (sixth.length > 0) yield this.timeoutHighestOdds(420000, sixth); // 420 sec

		//TODO: Le kell tesztelni
		for (let i = 0; i < loopLength; i++) {
			let limitedArr = this.allLeaguesId.slice(i * 9, (i + 1) * 9);

			if (limitedArr.length > 0) yield this.timeoutHighestOdds(65000, limitedArr); // 65 sec
		}
	});

	// Összes különöböző league id-t összegyűjti az elérhető meccsek alapján
	selectAllLeaguesId = flow(function* (this: ArbitrageStore, nextPage: number = 1) {
		const mapping: IOddsMapping = yield ArbitrageService.GetAvailableFixtures(nextPage);
		const mappingResponse: IOddsMappingResponse[] = mapping.response;
		//! fetch
		this.fetchNumber += 1;

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

		if (!this.totalPage) {
			this.totalPage = mapping.paging.total;
			console.log('ellenőrzéshez_total page:', this.totalPage);
		}
		this.nextPage = mapping.paging.current + 1;

		// //! Ez csak teszt szám
		// if (this.nextPage <= 2) {
		// 	yield this.selectAllLeaguesId(this.nextPage);
		// }

		// console.log('ellenőrzéshez_from mapping all mappingresponse:', toJS(mappingResponse));
		// console.log('ellenőrzéshez_from mapping all leagues id-s:', toJS(this.allLeaguesId));

		yield this.helperAllLeaguesId();

		return;
	});

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

				const fixtureDate = Date.parse(leaguesOdds[index].fixture?.date);

				console.log('bookmakers', leaguesOdds[index].bookmakers);

				if (Number(dateNow) - Number(fixtureDate) > 0) continue; //! már lejátszott meccs akkor tovább ugrik
				if (leaguesOdds[index].bookmakers.length < 1) continue; //! ha nincs bookmaker akkor tovább

				// console.log('bookmakersArray', bookmakersArray);
				const bookmakersArray: Bookmaker[] = leaguesOdds[index]?.bookmakers || [];

				const MATCH_WINNER_ARBITRAGE = yield this.analyzeBookmaker(bookmakersArray, BETS_TYPES.Vegeredmeny);
				const HOME_AWAY_ARBITRAGE = yield this.analyzeBookmaker(bookmakersArray, BETS_TYPES.HazaiVagyVendeg);

				let arbitrageObj: IArbitrage = {
					fixture: currentFixture,
					date: currentFixtureDate,
					country: currentLeagueCountry,
					analyzed: [MATCH_WINNER_ARBITRAGE, HOME_AWAY_ARBITRAGE]
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

	analyzeBookmaker = (bookmakers: Bookmaker[], betType: BETS_TYPES) => {
		let result: IAnalyzedResult = {
			highestOdds: null,
			arbitrage: null,
			name: null
		};
		//? twoParams
		const { MindketCsapatGol, HazaiVagyVendeg } = BETS_TYPES;
		const twoParams = [HazaiVagyVendeg, MindketCsapatGol];
		//? threeParams
		const { Vegeredmeny, ElsoFelidoVegeredmeny, MasodikFelidoVegeredmeny } = BETS_TYPES;
		const threeParams = [Vegeredmeny, ElsoFelidoVegeredmeny, MasodikFelidoVegeredmeny];

		let twoParamsStructure = [
			{ name: 'highestHome', bookmaker: '', odd: 0 },
			{ name: 'highestAway', bookmaker: '', odd: 0 }
		];
		let threeParamsStructure = [
			{ name: 'highestHome', bookmaker: '', odd: 0 },
			{ name: 'highestDraw', bookmaker: '', odd: 0 },
			{ name: 'highestAway', bookmaker: '', odd: 0 }
		];

		bookmakers.forEach((bookmaker) => {
			const selectedBet = bookmaker.bets.find((bet: Bet) => bet.name === betType);
			if (!selectedBet) return;

			//? NEW
			// if (twoParams.includes(betType)) {
			// 	selectedBet.values?.forEach((item: BetsValue, index) => {
			// 		if (Number(item.odd) > twoParamsStructure[index].odd) {
			// 			twoParamsStructure[index].odd = Number(item.odd);
			// 			twoParamsStructure[index].bookmaker = bookmaker.name;
			// 		}
			// 	});
			// }
			// if (threeParams.includes(betType)) {
			// 	selectedBet.values?.forEach((item: BetsValue, index) => {
			// 		if (Number(item.odd) > threeParamsStructure[index].odd) {
			// 			threeParamsStructure[index].odd = Number(item.odd);
			// 			threeParamsStructure[index].bookmaker = bookmaker.name;
			// 		}
			// 	});
			// }
			switch (betType) {
				case BETS_TYPES.Vegeredmeny:
					//? New matchWinner --> threeParamsStructure
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > threeParamsStructure[index].odd) {
							threeParamsStructure[index].odd = Number(item.odd);
							threeParamsStructure[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.HazaiVagyVendeg:
					//TODO:  values undefined hiba
					//? New homeAway --> twoParamsStructure
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > twoParamsStructure[index].odd) {
							twoParamsStructure[index].odd = Number(item.odd);
							twoParamsStructure[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.ElsoFelidoVegeredmeny:
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > threeParamsStructure[index].odd) {
							threeParamsStructure[index].odd = Number(item.odd);
							threeParamsStructure[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.MasodikFelidoVegeredmeny:
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > threeParamsStructure[index].odd) {
							threeParamsStructure[index].odd = Number(item.odd);
							threeParamsStructure[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.MindketCsapatGol:
					selectedBet.values?.forEach((item: BetsValue, index) => {
						if (Number(item.odd) > twoParamsStructure[index].odd) {
							twoParamsStructure[index].odd = Number(item.odd);
							twoParamsStructure[index].bookmaker = bookmaker.name;
						}
					});
					break;
				case BETS_TYPES.GolokSzama:
					console.log('Gól több vagy kevesebb', selectedBet);
			}
		});

		switch (betType) {
			case BETS_TYPES.Vegeredmeny:
				threeParamsStructure.forEach((item) => {
					result.arbitrage += 1 / Number(item.odd);
				});
				result.highestOdds = threeParamsStructure;
				break;
			case BETS_TYPES.HazaiVagyVendeg:
				twoParamsStructure.forEach((item) => {
					result.arbitrage += 1 / Number(item.odd);
				});
				result.highestOdds = twoParamsStructure;
				break;
		}
		result.name = betType;
		result.arbitrage = result.arbitrage.toFixed(3) as any;

		console.log(result);

		return result;
	};

	@computed get getFilteredArbitrages() {
		if (this.filtering === 'goodArbitrage') {
			// return this.Arbitrages.filter((it) => it.analyzed.some(item) => item.arbitrage < 0)
		}
		return [];
	}
}

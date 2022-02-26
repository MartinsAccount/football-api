import { action, computed, flow, observable, toJS } from 'mobx';
import { BETS_TYPES } from '../../../core/constants/constants';
import { Bet, BetsValue, Bookmaker } from '../../../core/models/models';
import { IAnalyzedResult, IArbitrage, IFilters, IHighestOdds } from '../models/models';
import { IOddsMapping, IOddsMappingResponse } from '../../OddsPage/models/models';
import { MainStore } from '../../../stores/MainStore';
import ApiURLs from '../../../services/ApiURLs';
import { ILeagueOddsResponse } from '../../OddsPage/models/IOdds';

export class ArbitrageStore {
	public MainStore: MainStore;

	private CALCULATE_ARBITRAGE: BETS_TYPES[] = [
		BETS_TYPES.Vegeredmeny,
		BETS_TYPES.HazaiVagyVendeg,
		BETS_TYPES.ElsoFelidoVegeredmeny,
		BETS_TYPES.MasodikFelidoVegeredmeny,
		BETS_TYPES.MindketCsapatGol,
		BETS_TYPES.ElsoFelidoMindketCsapatGol,
		BETS_TYPES.MasodikFelidoMindketCsapatGol,
		BETS_TYPES.HazaiMindketFelidoGyozelem,
		BETS_TYPES.VendegMindketFelidoGyozelem
	];
	private CALCULATE_GOAL_NUMBER_ARBITRAGE: BETS_TYPES[] = [
		BETS_TYPES.GolokSzama,
		BETS_TYPES.HazaiGolokSzama,
		BETS_TYPES.VendegGolokSzama
	];

	//* Legfontosabb, (egy meccs kártya az object)
	@observable Arbitrages: IArbitrage[] = [];

	@observable nextPage: number = null;
	@observable totalPage: number = null;

	@observable selectedItem: IAnalyzedResult = null;
	@observable filtering: IFilters = null;

	@observable allLeaguesId: Array<number> = [];
	@observable hasAllId: boolean = false;

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;

		this.Init();
	}

	Init = flow(function* (this: ArbitrageStore) {
		// this.Arbitrages = yield require('../../../data/testArbitrages.json');
	});

	@action setSelectedItem(item: IAnalyzedResult = null) {
		this.selectedItem = item;
	}

	@action setFilter(filter: IFilters) {
		this.filtering = filter;
	}

	testFetch = flow(function* (this: ArbitrageStore) {
		const ids = [39, 78, 61, 140];

		for (let index = 0; index < ids.length; index++) {
			// console.log('oldFetchNumber', this.fetchNumber);

			const resp = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_LEAGUE_ODDS(ids[index]));

			console.log('response', resp);
			// console.log('newFetchNumber', this.fetchNumber);
		}
	});

	// Összes különöböző league id-t összegyűjti az elérhető meccsek alapján
	selectAllLeaguesId = flow(function* (this: ArbitrageStore, nextPage: number = 1) {
		this.MainStore.isLoading = true;
		this.MainStore.loadingText = `League ID-k összegyűjtése => ${nextPage}/${this?.totalPage} oldal`;

		const mapping: IOddsMapping = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.AVAILABLE_FIXTURES_FOR_ODDS(nextPage));
		const mappingResponse: IOddsMappingResponse[] = mapping.response;

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

		// Ez csak teszt szám
		// if (this.nextPage <= 2) {
		// 	yield this.selectAllLeaguesId(this.nextPage);
		// }

		console.log('ellenőrzéshez_from mapping all mappingresponse:', toJS(mappingResponse));
		console.log('ellenőrzéshez_from mapping all leagues id-s:', toJS(this.allLeaguesId));

		yield this.helperAllLeaguesId();
		// teszt
		// yield this.helperHighestOdds();

		return;
	});

	helperAllLeaguesId = flow(function* (this: ArbitrageStore) {
		if (this.nextPage < this.totalPage && this.MainStore.fetchNumber % 10 !== 0) {
			yield this.selectAllLeaguesId(this.nextPage);
			return;
		}
		if (this.nextPage < this.totalPage && this.MainStore.fetchNumber % 10 === 0) {
			this.MainStore.loadingText = '60 másodperc szünet';
			yield this.timeoutAllLeaguesId(61000); // 61 sec
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

	timeoutAllLeaguesId(ms: number): Promise<NodeJS.Timeout> {
		return new Promise((resolve) => setTimeout(() => resolve(this.selectAllLeaguesId(this.nextPage)), ms));
	}

	helperHighestOdds = flow(function* (this: ArbitrageStore) {
		console.log('FOLYAMAT KEZDETE! -------------/getHighestOdds/-----------');

		let leaguesIds = [...this.allLeaguesId];
		let loopLength = Math.round(this.allLeaguesId.length / 9) + 1;

		//TODO: Le kell tesztelni - mehet 10-ig és 60 sec-el?
		for (let i = 0; i < loopLength; i++) {
			this.MainStore.loadingText = `Arbitrage elemzés... ${i * 9}/${leaguesIds.length}`;
			if (i * 9 > leaguesIds.length) this.MainStore.isLoading = false;

			let limitedArr = leaguesIds.slice(i * 9, (i + 1) * 9);

			if (limitedArr.length > 0) yield this.timeoutHighestOdds(61000, limitedArr); // 62 sec
		}
	});

	timeoutHighestOdds(ms: number, arr: Array<number>): Promise<unknown> {
		return new Promise((resolve) => setTimeout(() => resolve(this.getHighestOdds(arr)), ms));
	}

	// Minden fogadóirodánál megkeresi a legnagyobb oddsot (H, D, V) esetekre
	getHighestOdds = flow(function* (this: ArbitrageStore, leagueIds: Array<number>) {
		for (let index = 0; index < leagueIds.length; index++) {
			const dateNow = Date.parse(new Date().toDateString());

			const leagueId = leagueIds[index];
			console.log('ellenőrzéshez_éles current league id', leagueId);

			const { response } = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_LEAGUE_ODDS(leagueId));

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

				const CALCULATED_ARBITRAGE: IAnalyzedResult[] = [];

				for (let bet of this.CALCULATE_ARBITRAGE) {
					const result = yield this.analyzeBookmaker(bookmakersArray, bet);

					if (this.MainStore.fetchNumber > 180 && this.MainStore.fetchNumber < 200) {
						console.log('ARBITRAGES STRINGIFY', JSON.stringify(this.Arbitrages));
					}

					CALCULATED_ARBITRAGE.push(result);
				}
				for (let bet of this.CALCULATE_GOAL_NUMBER_ARBITRAGE) {
					const goals = [2.5, 3.5];

					for (let goal of goals) {
						const result = yield this.analyzeBookmaker(bookmakersArray, bet, goal);

						CALCULATED_ARBITRAGE.push(result);
					}
				}

				let arbitrageObj: IArbitrage = {
					fixture: currentFixture,
					date: currentFixtureDate,
					country: currentLeagueCountry,
					leagueName: currentLeagueName,
					analyzed: [...CALCULATED_ARBITRAGE] //? New
				};

				this.Arbitrages.push(arbitrageObj);
				this.MainStore.isLoading = false;

				console.log('----------Arbitrage number----------', toJS(this.Arbitrages));
				console.log('FINISHED--FINISHED--FINISHED---FINISHED---FINISHED---FINISHED---FINISHED---FINISHED---FINISHED---FINISHED');
			}
		}
	});

	analyzeBookmaker = (bookmakers: Bookmaker[], betType: BETS_TYPES, expectGoals?: number): IAnalyzedResult => {
		let result: IAnalyzedResult = {
			highestOdds: null,
			arbitrage: null,
			name: betType
		};
		//? twoParams
		const {
			MindketCsapatGol,
			HazaiVagyVendeg,
			ElsoFelidoMindketCsapatGol,
			MasodikFelidoMindketCsapatGol,
			HazaiMindketFelidoGyozelem,
			VendegMindketFelidoGyozelem,
			GolokSzama,
			HazaiGolokSzama,
			VendegGolokSzama
		} = BETS_TYPES;

		const twoParams = [
			HazaiVagyVendeg,
			MindketCsapatGol,
			ElsoFelidoMindketCsapatGol,
			MasodikFelidoMindketCsapatGol,
			HazaiMindketFelidoGyozelem,
			VendegMindketFelidoGyozelem
		];
		const specialTwoParams = [GolokSzama, HazaiGolokSzama, VendegGolokSzama];

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

		// TODO: 'Goals Over/Under' {value: 'Over 3.5', odd: '2.55'},  {value: 'Under 4.5', odd: '1.20'}
		//? Over 3.5 és Under 3.5 ods elemzése

		bookmakers.forEach((bookmaker: Bookmaker) => {
			const selectedBet = bookmaker.bets.find((bet: Bet) => bet.name === betType);
			if (!selectedBet) return;

			//? NEW
			if (twoParams.includes(betType)) {
				selectedBet.values?.forEach((item: BetsValue, index) => {
					if (Number(item.odd) > twoParamsStructure[index].odd) {
						twoParamsStructure[index].name = item?.value;
						twoParamsStructure[index].odd = Number(item.odd);
						twoParamsStructure[index].bookmaker = bookmaker.name;
					}
				});
				return;
			}
			if (threeParams.includes(betType)) {
				selectedBet.values?.forEach((item: BetsValue, index) => {
					if (Number(item.odd) > threeParamsStructure[index].odd) {
						threeParamsStructure[index].name = item?.value;
						threeParamsStructure[index].odd = Number(item.odd);
						threeParamsStructure[index].bookmaker = bookmaker.name;
					}
				});
				return;
			}
			// [{value: Over 2.5, odd: "2"}, {value: "Over 3.5", odd: "4"}]
			if (specialTwoParams.includes(betType)) {
				// TODO: dinamic
				const searchGoalNumber = expectGoals;
				const searchParams = [`Over ${searchGoalNumber}`, `Under ${searchGoalNumber}`];

				searchParams.forEach((param: string, index: number) => {
					const searchedItem = selectedBet.values.find((item: BetsValue) => item?.value === param);

					if (Number(searchedItem?.odd) > twoParamsStructure[index].odd) {
						twoParamsStructure[index].name = searchedItem?.value;
						twoParamsStructure[index].odd = Number(searchedItem?.odd);
						twoParamsStructure[index].bookmaker = bookmaker.name;
					}
				});
				return;
			}
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
		if (specialTwoParams.includes(betType)) {
			twoParamsStructure.forEach((item: IHighestOdds) => {
				result.arbitrage += 1 / Number(item.odd);
			});
			result.highestOdds = twoParamsStructure;
		}

		result.arbitrage = Number(result.arbitrage.toFixed(3));

		// console.log('result', result);
		// console.log('this_Arbitrages', JSON.stringify(toJS(this.Arbitrages)));

		return result;
	};

	@computed get getArbitrages() {
		if (this.filtering === 'goodArbitrage') {
			return this.Arbitrages.filter((it) => it.analyzed.some((item) => Number(item.arbitrage) < 1 && item.arbitrage !== null));
		}
		return this.Arbitrages;
	}

	@computed get topBookmakers() {
		const _topBookmakers = {};

		this.Arbitrages.map((it: IArbitrage) => it.analyzed).forEach((item: IAnalyzedResult[]) => {
			item.forEach((i: IAnalyzedResult) => {
				// let isGood = +i.arbitrage < 1;

				i.highestOdds.forEach((obj: IHighestOdds) => {
					if (_topBookmakers[obj.bookmaker]) {
						_topBookmakers[obj.bookmaker] += 1;
						return;
					}
					_topBookmakers[obj.bookmaker] = 1;
				});

				return;
			});
		});

		// William Hill, 1xBet, Marathonbet, Bet365, Unibet, Bwin, NordicBet
		return _topBookmakers;
	}
}

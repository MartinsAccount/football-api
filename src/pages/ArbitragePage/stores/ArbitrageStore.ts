import { action, computed, flow, observable, toJS } from 'mobx';
import { Bet, BetsValue, Bookmaker, IBetsTypes } from '../../../core/models/models';
import { IAnalyzedFixture, IArbitrage, IFilters, IHighestOdds } from '../models/models';
import { IOddsMapping, IOddsMappingResponse } from '../../OddsPage/models/models';
import { MainStore } from '../../../stores/MainStore';
import ApiURLs from '../../../services/ApiURLs';
import { ILeagueOddsResponse } from '../../OddsPage/models/IOdds';
import { BETS_TYPES } from '../../../core/constants/BetTypes';
import { LocalStorageUtil } from '../../../shared/utils/LocalStorageUtil';
import { IInformations } from '../models/IInformations';
import { IArbitrageRange } from '../models/IArbitrageRange';
import { IArbitrageByBetType } from '../models/IArbitrageByBetType';
import { Fixture } from '../../FixturePage/models/models';

// TODO cache data hogy egy nap többször lehessen használni

type IFilterBlocks = 'bookmakers' | 'betTypes' | 'arbitrageRanges' | 'parameters' | 'listView';

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
	@observable Arbitrages: IAnalyzedFixture[] = [];
	@observable ArbitragesByBetType: IArbitrageByBetType[] = [];

	@observable nextPage: number = null;
	@observable totalPage: number = null;

	@observable allLeagueIds: Array<number> = [];
	@observable hasAllId: boolean = false;

	// content
	@observable selectedItem: IArbitrage = null;
	@observable selectedListItem: IArbitrageByBetType = null;
	@observable fixtureInformation: Fixture = null;
	@observable isLoadingFixtureInformation: boolean = false;
	@observable isOpenFixtureInformationModal: boolean = false;

	// filters
	@observable filtering: IFilters = 'goodArbitrage';
	@observable openedFilterBlocks: IFilterBlocks[] = [];
	@observable activeArbitrageRangeFilter: IArbitrageRange = null;
	@observable filteredBetTypes: string[] = [];
	@observable filteredBookmakers: string[] = [];
	@observable selectedParameters: 'twoParameter' | 'threeParameter' = null;

	@observable activeListView: 'original' | 'betType' = 'betType';

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;

		// this.Init();
	}

	Init = flow(function* (this: ArbitrageStore) {
		yield this.searchAllLeagueIds(1, true); // load from cache
	});

	@action setSelectedItem(item: IArbitrage = null) {
		this.selectedItem = item;
	}

	@action setIsOpenFixtureInformationModal(open: boolean) {
		this.isOpenFixtureInformationModal = open;
	}

	selectArbitrageByBetTypeItem = flow(function* (this: ArbitrageStore, item: IArbitrageByBetType = null) {
		this.isLoadingFixtureInformation = true;

		this.selectedListItem = item;
		this.setIsOpenFixtureInformationModal(true);

		const fixture = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_FIXTURE(item.data.fixture));

		this.fixtureInformation = fixture.response[0];
		console.log('fixture', fixture);

		this.isLoadingFixtureInformation = false;
	});

	isSelectedListItem = (item: IArbitrageByBetType) => {
		if (!this.selectedListItem) return false;

		let { arbitrage, betType } = this.selectedListItem;
		let { arbitrage: itemArbitrage, betType: itemBetType } = item;

		return arbitrage === itemArbitrage && betType === itemBetType && this.selectedListItem.data.fixture === item.data.fixture;
	};

	// #region Filters
	@action setFilter(filter: IFilters) {
		this.filtering = filter;
	}

	@action resetFilters() {
		this.openedFilterBlocks = [];
		this.activeArbitrageRangeFilter = null;
		this.filteredBetTypes = [];
		this.filteredBookmakers = [];
		this.selectedParameters = null;
		this.activeListView = 'betType';
	}

	@action toggleFilterBlock(filterBlock: IFilterBlocks) {
		console.log('toggleFilterBlock click', filterBlock);
		const findeIndex = this.openedFilterBlocks.findIndex((f) => f === filterBlock);
		let newOpenedFilterBlocks = [...this.openedFilterBlocks];

		if (findeIndex === -1) {
			newOpenedFilterBlocks.push(filterBlock);
		} else {
			newOpenedFilterBlocks.splice(findeIndex, 1);
		}

		this.openedFilterBlocks = newOpenedFilterBlocks;
	}

	@action toggleBetTypeFilter(betType: string) {
		const findeIndex = this.filteredBetTypes.findIndex((f) => f === betType);
		let newFilteredBetTypes = [...this.filteredBetTypes];

		if (findeIndex === -1) {
			newFilteredBetTypes.push(betType);
		} else {
			newFilteredBetTypes.splice(findeIndex, 1);
		}

		this.filteredBetTypes = newFilteredBetTypes;
	}
	@action toggleBookmakerFilter(bookmaker: string) {
		const findeIndex = this.filteredBookmakers.findIndex((f) => f === bookmaker);
		let newFilteredBookmakers = [...this.filteredBookmakers];

		if (findeIndex === -1) {
			newFilteredBookmakers.push(bookmaker);
		} else {
			newFilteredBookmakers.splice(findeIndex, 1);
		}

		this.filteredBookmakers = newFilteredBookmakers;
	}

	@action addArbitrageRangeFilter(range: IArbitrageRange) {
		if (this.activeArbitrageRangeFilter?.from === range.from) {
			this.activeArbitrageRangeFilter = null;
			return;
		}

		this.activeArbitrageRangeFilter = range;
	}

	@action selectParameters(parameters: 'twoParameter' | 'threeParameter') {
		if (this.selectedParameters === parameters) this.selectedParameters = null;
		else this.selectedParameters = parameters;
	}
	@action changeListView(view: 'original' | 'betType') {
		this.activeListView = view;
	}
	// #endregion Filters

	testFetch = flow(function* (this: ArbitrageStore) {
		const ids = [39, 78, 61, 140];

		for (let index = 0; index < ids.length; index++) {
			// console.log('oldFetchNumber', this.fetchNumber);

			const resp = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_LEAGUE_ODDS(ids[index]));

			console.log('response', resp);
			// console.log('newFetchNumber', this.fetchNumber);
		}
	});

	// 1. Összes különöböző league id-t összegyűjti az elérhető meccsek alapján
	searchAllLeagueIds = flow(function* (this: ArbitrageStore, nextPage: number = 1, dataFromCache: boolean = false) {
		this.MainStore.isLoading = true;
		this.MainStore.loadingText = `League ID-k összegyűjtése => ${nextPage} / ${this.totalPage || '..'} oldal`;

		if (dataFromCache) {
			const cachedAllLeagueIds = LocalStorageUtil.Get('AllLeagueIds');
			const cachedArbitrages = LocalStorageUtil.Get('Arbitrages');

			this.allLeagueIds = cachedAllLeagueIds;
			this.Arbitrages = cachedArbitrages;

			this.MainStore.isLoading = false;
			this.MainStore.loadingText = null;
			return;
		} else {
			this.Arbitrages = [];

			const mapping: IOddsMapping = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.AVAILABLE_FIXTURES_FOR_ODDS(nextPage));
			const mappingResponse: IOddsMappingResponse[] = mapping.response;

			const dateNow = Date.parse(new Date().toDateString()); // pl.: 1643842800000

			yield mappingResponse.forEach((item: IOddsMappingResponse) => {
				const fixtureDate = Date.parse(item.fixture.date); // meccs időpont

				const isFinishedFixture = Number(dateNow) > Number(fixtureDate); // jelenlegi időpontnál későbbi meccs / még nem játszott le (mai dátum nagyobb mint a mérközés dátuma)
				const isMissingLeagueId = !this.allLeagueIds.includes(item.league.id);

				if (!isFinishedFixture && isMissingLeagueId) {
					this.allLeagueIds = [...this.allLeagueIds, item.league.id];
				}
			});

			if (!this.totalPage) {
				this.totalPage = mapping.paging.total;
				console.log('ellenőrzéshez_totalPage:', this.totalPage);
			}

			this.nextPage = mapping.paging.current + 1;

			console.log('ellenőrzéshez_from mapping all mappingresponse:', toJS(mappingResponse));
			console.log('ellenőrzéshez_from mapping all leagues id-s:', toJS(this.allLeagueIds));
		}

		// Ez csak teszt szám
		// if (this.nextPage <= 2) {
		// 	yield this.selectAllLeaguesId(this.nextPage);
		// }

		yield this.searchHelperAllLeagueIds();

		return;
	});

	// limiált kérések miatt 1 perces késleltetés a a további kérésekre (ingyenes api key-el 10 kérés / perc)
	helperAllLeaguesId = flow(function* (this: ArbitrageStore) {
		if (this.nextPage < this.totalPage && this.MainStore.fetchNumber % 10 !== 0) {
			yield this.searchAllLeagueIds(this.nextPage);
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
			console.log('FOLYAMAT VÉGE! /All leagues Id/:', toJS(this.allLeagueIds));
			yield this.helperHighestOdds();
		}
	});

	searchHelperAllLeagueIds = flow(function* (this: ArbitrageStore) {
		if (this.nextPage < this.totalPage) {
			yield this.searchAllLeagueIds(this.nextPage);
			return;
		}

		if (this.nextPage === this.totalPage) {
			this.hasAllId = true;
		}

		if (this.hasAllId) {
			console.log('FOLYAMAT VÉGE! /All leagues Id/:', toJS(this.allLeagueIds));
			LocalStorageUtil.Set('AllLeagueIds', toJS(this.allLeagueIds), LocalStorageUtil.OneYear);

			yield this.helperHighestOdds();
		}
	});

	timeoutAllLeaguesId(ms: number): Promise<NodeJS.Timeout> {
		return new Promise((resolve) => setTimeout(() => resolve(this.searchAllLeagueIds(this.nextPage)), ms));
	}

	helperHighestOdds = flow(function* (this: ArbitrageStore) {
		console.log('FOLYAMAT KEZDETE! -------------/getHighestOdds/-----------');

		const leagueIds = [...this.allLeagueIds];
		const limitedData = leagueIds.slice(0, 30);

		for (let i = 0; i < leagueIds.length; i++) {
			this.MainStore.loadingText = `Arbitrage elemzés... ${i} / ${leagueIds.length}`;

			const currentLeagueId = leagueIds[i];

			yield this.getHighestOdds(currentLeagueId);
		}

		// if (limitedData.length > 0) yield this.getHighestOdds(limitedData);
		LocalStorageUtil.Set('Arbitrages', toJS(this.Arbitrages), LocalStorageUtil.OneYear);
		this.MainStore.isLoading = false;
		console.log('FINISHED--FINISHED--FINISHED---FINISHED---FINISHED---FINISHED---FINISHED---FINISHED---FINISHED---FINISHED');
	});
	// helperHighestOdds = flow(function* (this: ArbitrageStore) {
	// 	console.log('FOLYAMAT KEZDETE! -------------/getHighestOdds/-----------');

	// 	let leaguesIds = [...this.allLeagueIds];
	// 	let loopLength = Math.round(this.allLeagueIds.length / 9) + 1;

	// 	//TODO: Le kell tesztelni - mehet 10-ig és 60 sec-el?
	// 	for (let i = 0; i < loopLength; i++) {
	// 		this.MainStore.loadingText = `Arbitrage elemzés... ${i * 9}/${leaguesIds.length}`;
	// 		if (i * 9 > leaguesIds.length) this.MainStore.isLoading = false;

	// 		let limitedArr = leaguesIds.slice(i * 9, (i + 1) * 9);

	// 		if (limitedArr.length > 0) yield this.timeoutHighestOdds(61000, limitedArr); // 62 sec
	// 	}
	// });

	// timeoutHighestOdds(ms: number, arr: Array<number>): Promise<unknown> {
	// 	return new Promise((resolve) => setTimeout(() => resolve(this.getHighestOdds(arr)), ms));
	// }

	// Minden fogadóirodánál megkeresi a legnagyobb oddsot (H, D, V) esetekre
	getHighestOdds = flow(function* (this: ArbitrageStore, currentLeagueId: number) {
		const dateNow = Date.parse(new Date().toDateString());
		const leagueId = currentLeagueId;

		const { response } = yield this.MainStore.FetchService.get(ApiURLs.FOOTBALL.GET_LEAGUE_ODDS(leagueId));

		// összes mérkőzés az adott ligában, oddsokkal együtt fogadóirodákra bontva
		const fixturesWithBookmakers: ILeagueOddsResponse[] = response;

		// CONSOLE LOG
		if (this.MainStore.fetchNumber > 20 && this.MainStore.fetchNumber < 22) {
			console.log('ellenőrzéshez_éles current league id', leagueId);
			console.log('ellenőrzéshez_fixturesWithBookmakers:', fixturesWithBookmakers);
		}

		for (let index = 0; index < fixturesWithBookmakers.length; index++) {
			const currentFixture = fixturesWithBookmakers[index].fixture.id;
			const currentFixtureDate = fixturesWithBookmakers[index].fixture?.date || 'nincs dátum';
			const currentLeagueCountry = fixturesWithBookmakers[index].league?.country || 'nincs ország';
			const currentLeagueName = fixturesWithBookmakers[index].league?.name || 'nincs név';

			const fixtureDate = Date.parse(fixturesWithBookmakers[index].fixture?.date);

			// CONSOLE LOG
			if (this.MainStore.fetchNumber > 20 && this.MainStore.fetchNumber < 22) {
				console.log('bookmakers', fixturesWithBookmakers[index].bookmakers);
				console.log('----------Arbitrage number----------', toJS(this.Arbitrages));
			}

			if (Number(dateNow) - Number(fixtureDate) > 0) continue; //! már lejátszott meccs akkor tovább ugrik
			if (fixturesWithBookmakers[index].bookmakers.length < 1) continue; //! ha nincs bookmaker akkor tovább

			// adott meccshez tartózó fogadóirodák oddsokkal fogadási típusok szerint
			const bookmakers: Bookmaker[] = fixturesWithBookmakers[index]?.bookmakers || [];

			const CALCULATED_ARBITRAGE: IArbitrage[] = [];

			for (let bet of this.CALCULATE_ARBITRAGE) {
				const result = yield this.analyzeBookmaker(bookmakers, bet);

				CALCULATED_ARBITRAGE.push(result);
			}
			for (let bet of this.CALCULATE_GOAL_NUMBER_ARBITRAGE) {
				const goals = [2.5, 3.5];

				for (let goal of goals) {
					const result = yield this.analyzeBookmaker(bookmakers, bet, goal);

					CALCULATED_ARBITRAGE.push(result);
				}
			}

			let arbitrageObj: IAnalyzedFixture = {
				fixture: currentFixture,
				date: currentFixtureDate,
				country: currentLeagueCountry,
				leagueName: currentLeagueName,
				arbitrages: [...CALCULATED_ARBITRAGE] //? New
			};

			this.Arbitrages.push(arbitrageObj);
		}
	});

	analyzeBookmaker = (bookmakers: Bookmaker[], betType: BETS_TYPES, expectGoals?: number): IArbitrage => {
		let result: IArbitrage = {
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

		// search highest odds / bookmaker / bet type
		bookmakers.forEach((bookmaker: Bookmaker) => {
			const selectedBet = bookmaker.bets.find((bet: Bet) => bet.name === betType);
			if (!selectedBet) return;

			if (twoParams.includes(betType)) {
				selectedBet.values?.forEach((item: BetsValue, index) => {
					const isHigherOdd = Number(item.odd) > twoParamsStructure[index].odd;

					if (isHigherOdd) {
						twoParamsStructure[index].name = item?.value;
						twoParamsStructure[index].odd = Number(item.odd);
						twoParamsStructure[index].bookmaker = bookmaker.name;
					}
				});
				return;
			}
			if (threeParams.includes(betType)) {
				selectedBet.values?.forEach((item: BetsValue, index) => {
					const isHigherOdd = Number(item.odd) > threeParamsStructure[index].odd;

					if (isHigherOdd) {
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
					const isHigherOdd = Number(searchedItem?.odd) > twoParamsStructure[index].odd;

					if (isHigherOdd) {
						twoParamsStructure[index].name = searchedItem?.value;
						twoParamsStructure[index].odd = Number(searchedItem?.odd);
						twoParamsStructure[index].bookmaker = bookmaker.name;
					}
				});

				return;
			}
		});

		// calculate arbitrage
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
		let filteredItems = [...this.Arbitrages];

		if (this.filtering === 'goodArbitrage') {
			filteredItems = this.Arbitrages.filter((it) =>
				it.arbitrages.some((item) => Number(item.arbitrage) < 1 && item.arbitrage !== null)
			);
		}

		// if (this.activeArbitrageRangeFilter) {
		// 	const from = this.activeArbitrageRangeFilter.from;
		// 	const to = this.activeArbitrageRangeFilter.to;
		// 	filteredItems = filteredItems.filter((it) =>
		// 		it.arbitrages.some((item) => Number(item.arbitrage) >= from && Number(item.arbitrage) < to && item.arbitrage !== null)
		// 	);
		// }

		// if (this.filteredBetTypes.length > 0) {
		// 	filteredItems = filteredItems.filter((it) => it.arbitrages.some((item) => this.filteredBetTypes.includes(item.name)));
		// }

		// if (this.filteredBookmakers.length > 0) {
		// 	filteredItems = filteredItems.filter((it) =>
		// 		it.arbitrages.some((item) => {
		// 			return item.highestOdds.some((obj: IHighestOdds) => {
		// 				return this.filteredBookmakers.includes(obj.bookmaker);
		// 			});
		// 		})
		// 	);
		// }

		return filteredItems;
	}

	@computed get getArbitragesByBetType(): IArbitrageByBetType[] {
		let filteredItems = [...this.Arbitrages];

		// // fixtures where arbitrages less than 1
		// filteredItems = filteredItems.filter((it) =>
		// 	it.arbitrages.some((item) => Number(item.arbitrage) < 1 && item.arbitrage !== null)
		// );

		// !ez ugyanaz mint az alatta levő két for ciklus
		// filteredItems.forEach(({ arbitrages, ...analyzedFixture }) => {
		// 	convertByBetType.push(
		// 	  ...arbitrages.map((arbitrage) => ({
		// 		betType: arbitrage.name,
		// 		arbitrage: arbitrage.arbitrage,
		// 		bookmakers: arbitrage.highestOdds,
		// 		data: analyzedFixture
		// 	  }))
		// 	);
		//   });
		// ! ez szintén, talán a legjobb is
		// const convertByBetType = filteredItems
		// 	.map((analyzedFixture) =>
		// 		analyzedFixture.arbitrages.map((arbitrage) => ({
		// 			betType: arbitrage.name,
		// 			arbitrage: arbitrage.arbitrage,
		// 			bookmakers: arbitrage.highestOdds,
		// 			data: analyzedFixture
		// 		}))
		// 	)
		// 	.flat();
		let convertByBetType: IArbitrageByBetType[] = [];

		for (let index = 0; index < filteredItems.length; index++) {
			const analyzedFixture = filteredItems[index];
			const arbitrages = analyzedFixture.arbitrages;

			for (let i = 0; i < arbitrages.length; i++) {
				const arbitrage = arbitrages[i];

				const pushedItem: IArbitrageByBetType = {
					betType: arbitrage.name,
					arbitrage: arbitrage.arbitrage,
					bookmakers: arbitrage.highestOdds,
					data: analyzedFixture
				};

				convertByBetType.push(pushedItem);
			}
		}

		convertByBetType = convertByBetType.filter((it) => Number(it.arbitrage) < 1 && it.arbitrage !== null);

		if (this.activeArbitrageRangeFilter) {
			const { from, to } = this.activeArbitrageRangeFilter;

			convertByBetType = convertByBetType.filter(
				(it) => Number(it.arbitrage) >= from && Number(it.arbitrage) < to && it.arbitrage !== null
			);
		}

		if (this.filteredBetTypes.length > 0) {
			convertByBetType = convertByBetType.filter((it) => this.filteredBetTypes.includes(it.betType));
		}

		if (this.selectedParameters !== null) {
			switch (this.selectedParameters) {
				case 'twoParameter':
					convertByBetType = convertByBetType.filter((it) => it.bookmakers.length === 2);
					break;
				case 'threeParameter':
					convertByBetType = convertByBetType.filter((it) => it.bookmakers.length === 3);
					break;
			}
		}

		//! itt az elég ha 1 bookmakernek benne van a kiválasztott bookmakerek között
		if (this.filteredBookmakers.length > 0) {
			convertByBetType = convertByBetType.filter((it) =>
				it.bookmakers.some((bookmaker) => this.filteredBookmakers.includes(bookmaker.bookmaker))
			);
		}

		//! itt az összes viláasztott bookmakernek benne kell lennie a bookmakerek között
		// if (this.filteredBookmakers.length > 0) {
		// 	convertByBetType = convertByBetType.filter((it) =>
		// 		this.filteredBookmakers.every((filteredBookmaker) =>
		// 			it.bookmakers.some((bookmaker) => bookmaker.bookmaker === filteredBookmaker)
		// 		)
		// 	);
		// }

		//! itt az összes bookmakernek benne kell lennie a kiválasztott bookmakerek között
		// if (this.filteredBookmakers.length > 0) {
		// 	convertByBetType = convertByBetType.filter((it) =>
		// 		it.bookmakers.every((bookmaker) => this.filteredBookmakers.includes(bookmaker.bookmaker))
		// 	);
		// }

		return convertByBetType;
	}

	@computed get getParametersFrequency(): { twoParameter: number; threeParameter: number } {
		const parameters = { twoParameter: 0, threeParameter: 0 };

		if (this.isBetTypeView) {
			this.getArbitragesByBetType.forEach((arbitrage) => {
				if (arbitrage.bookmakers.length === 2) parameters.twoParameter += 1;
				else if (arbitrage.bookmakers.length === 3) parameters.threeParameter += 1;
			});
		} else {
		}

		return parameters;
	}
	@computed get getArbitrageRanges(): IArbitrageRange[] {
		const ranges = [
			{ from: 0.96, to: 1, frequency: 0 },
			{ from: 0.91, to: 0.96, frequency: 0 },
			{ from: 0.85, to: 0.91, frequency: 0 },
			{ from: 0, to: 0.85, frequency: 0 }
		];

		if (this.isBetTypeView) {
			this.getArbitragesByBetType.forEach((arbitrage) => {
				if (arbitrage.arbitrage) {
					ranges.forEach((range, index) => {
						let from = range.from;
						let to = range.to;

						if (arbitrage.arbitrage >= from && arbitrage.arbitrage < to) {
							ranges[index]['frequency'] += 1;
						}
					});
				}
			});
		} else {
			this.getArbitrages
				.map((it: IAnalyzedFixture) => it.arbitrages)
				.forEach((item: IArbitrage[]) => {
					item.forEach((i: IArbitrage) => {
						if (i.arbitrage) {
							ranges.forEach((range, index) => {
								let from = range.from;
								let to = range.to;

								if (i.arbitrage >= from && i.arbitrage < to) {
									ranges[index]['frequency'] += 1;
								}
							});
						}

						return;
					});
				});
		}

		return ranges;
	}

	@computed get getBookmakers(): [string, number][] {
		const _topBookmakers: Record<string, number> = {};

		if (this.isBetTypeView) {
			this.getArbitragesByBetType.forEach((arbitrage) =>
				arbitrage.bookmakers.forEach((bookmaker) => {
					if (bookmaker.bookmaker) {
						if (_topBookmakers[bookmaker.bookmaker]) {
							_topBookmakers[bookmaker.bookmaker] += 1;
						} else {
							_topBookmakers[bookmaker.bookmaker] = 1;
						}
					}
				})
			);
		} else {
			this.getArbitrages
				.map((it: IAnalyzedFixture) => it.arbitrages)
				.forEach((item: IArbitrage[]) => {
					item.forEach((i: IArbitrage) => {
						// let isGood = +i.arbitrage < 1;

						i.highestOdds.forEach((obj: IHighestOdds) => {
							if (obj.bookmaker) {
								if (_topBookmakers[obj.bookmaker]) {
									let isGood = +i.arbitrage < 1;

									if (isGood) _topBookmakers[obj.bookmaker] += 1;
									return;
								}
								_topBookmakers[obj.bookmaker] = 1;
							}
						});

						return;
					});
				});
		}

		// William Hill, 1xBet, Marathonbet, Bet365, Unibet, Bwin, NordicBet
		const arrayFromObject = Object.entries(_topBookmakers);
		const sortedBookmakers = arrayFromObject.sort((a, b) => b[1] - a[1]);

		return sortedBookmakers;
	}
	// !ugyanaz mint felette csak rövidebb
	// @computed get getBookmakers(): [string, number][] {
	// 	const topBookmakers: Record<string, number> = {};

	// 	this.getArbitrages.forEach((analyzedFixture: IAnalyzedFixture) => {
	// 	  analyzedFixture.arbitrages.forEach((arbitrage: IArbitrage) => {
	// 		arbitrage.highestOdds.forEach((obj: IHighestOdds) => {
	// 		  if (obj.bookmaker) {
	// 			if (topBookmakers[obj.bookmaker]) {
	// 			  if (+arbitrage.arbitrage < 1) {
	// 				topBookmakers[obj.bookmaker] += 1;
	// 			  }
	// 			  return;
	// 			}
	// 			topBookmakers[obj.bookmaker] = 1;
	// 		  }
	// 		});
	// 	  });
	// 	});

	@computed get getBetTypes(): [string, number][] {
		const betTypes: Record<string, number> = {};

		this.getArbitrages
			.map((it: IAnalyzedFixture) => it.arbitrages)
			.forEach((item: IArbitrage[]) => {
				item.forEach((i: IArbitrage) => {
					let isGood = +i.arbitrage < 1;

					if (!betTypes[i.name]) {
						betTypes[i.name] = 0;
					}

					if (isGood && !!i.arbitrage) {
						betTypes[i.name] += 1;
					}

					return;
				});
			});

		// William Hill, 1xBet, Marathonbet, Bet365, Unibet, Bwin, NordicBet
		const arrayFromObject = Object.entries(betTypes);
		const sorteBetTypes = arrayFromObject.sort((a, b) => b[1] - a[1]);

		return sorteBetTypes;
	}

	@computed get getInformations(): IInformations {
		const informations: IInformations = {
			fixtures: this.getArbitrages.length ?? 0,
			allArbitrage: 0,
			goodArbitrage: 0,
			goodWithTwoParams: 0,
			gooWithThreeParams: 0
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

		this.getArbitrages
			.map((it: IAnalyzedFixture) => it.arbitrages)
			.forEach((item: IArbitrage[]) => {
				item.forEach((i: IArbitrage) => {
					if (i.arbitrage) {
						let isGood = +i.arbitrage < 1;

						if (isGood) {
							informations.goodArbitrage += 1;

							if (twoParams.includes(i.name as any) || specialTwoParams.includes(i.name as any)) {
								informations.goodWithTwoParams += 1;
							} else if (threeParams.includes(i.name as any)) {
								informations.gooWithThreeParams += 1;
							}
						} else {
							informations.allArbitrage += 1;
						}
					}

					return;
				});
			});

		return informations;
	}

	@computed get isBetTypeView(): boolean {
		return this.activeListView === 'betType';
	}
}

import { flow, observable } from 'mobx';
import DataService from '../services/DataService';
import { ArbitrageStore } from './ArbitrageStore';
import { FixtureStore } from './FixtureStore';
import { OddsStore } from './OddsStore';

export class MainStore {
	public OddsStore: OddsStore;
	public ArbitrageStore: ArbitrageStore;
	public FixtureStore: FixtureStore;

	@observable public isLoading: boolean = false;

	@observable public Sport: string;

	constructor() {
		this.Sport = 'football';

		this.OddsStore = new OddsStore(this);
		this.ArbitrageStore = new ArbitrageStore(this);
		this.FixtureStore = new FixtureStore(this);

		this.OddsStore.Init();
		// this.ArbitrageStore.Init();
	}

	Init = flow(function* (this: MainStore) {});

	testFetch = flow(function* (this: MainStore) {
		// const curRound = yield DataService.GetCurrentRound(LEAGUES.ENGLAND);
		// const response = yield DataService.GetCustomSeasonFixtures(2020, LEAGUES.ITALY);
		// const response = yield DataService.GetUefaChampionsLeagueFixtures();
		const response = yield DataService.GetUefaEuropaLeagueFixtures();
		// const response = yield DataService.GetTodayFixtures();
		// const response = yield DataService.GetStatistics(710559);
		// const response = yield DataService.GetLeagues();
		// console.log(curRound);
		console.log(response);
		console.log(JSON.stringify(response));
	});

	baseballFetch = flow(function* (this: MainStore) {
		const response = yield DataService.GetHighestBaseballOdds();

		const arbitrageOdd = 1 / response[0].odd + 1 / response[1].odd;

		console.log('arbitrageOdd', arbitrageOdd);
		console.log('response', response);
	});

	// TODO: FetchService
	basketballFetch = flow(function* (this: MainStore) {
		const response = yield DataService.GetHighestBasketballOdds();
		const arbitrageOdd = 1 / response[0].odd + 1 / response[1].odd;

		console.log('arbitrageOdd', arbitrageOdd);
		console.log('response', response);
	});
}

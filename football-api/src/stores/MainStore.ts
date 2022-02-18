import { action, flow, observable } from 'mobx';
import { ArbitrageStore } from '../pages/ArbitragePage/stores/ArbitrageStore';
import { FixtureStore } from '../pages/FixturePage/stores/FixtureStore';
import { OddsStore } from '../pages/OddsPage/stores/OddsStore';
import { FetchService } from '../services/FetchService';

export class MainStore {
	public OddsStore: OddsStore;
	public ArbitrageStore: ArbitrageStore;
	public FixtureStore: FixtureStore;

	public FetchService: FetchService;

	@observable public isLoading: boolean = false;
	@observable public loadingText: string = 'Loading...';

	@observable fetchNumber: number = 0;

	@observable public Sport: string;

	constructor() {
		this.Sport = 'football';
		this.FetchService = new FetchService(this);

		this.OddsStore = new OddsStore(this);
		this.ArbitrageStore = new ArbitrageStore(this);
		this.FixtureStore = new FixtureStore(this);

		this.Init();
	}

	Init = flow(function* (this: MainStore) {
		try {
			yield this.OddsStore.Init();
			// yield this.ArbitrageStore.Init();
			// yield this.FixtureStore.Init();
		} catch (e) {
			console.log('error', e);
		}
	});

	@action increaseFetchNumber() {
		this.fetchNumber += 1;
	}
}

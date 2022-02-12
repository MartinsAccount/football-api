import { flow, observable } from 'mobx';
import DataService from '../services/DataService';
import { ArbitrageStore } from '../pages/ArbitragePage/stores/ArbitrageStore';
import { FixtureStore } from '../pages/FixturePage/stores/FixtureStore';
import { OddsStore } from '../pages/OddsPage/stores/OddsStore';
import { FetchService2 } from '../services/FetchService2';

export class MainStore {
	public OddsStore: OddsStore;
	public ArbitrageStore: ArbitrageStore;
	public FixtureStore: FixtureStore;

	public FetchService2: FetchService2;

	@observable public isLoading: boolean = false;
	@observable public loadingText: string = 'Loading...';

	@observable public Sport: string;

	constructor() {
		this.Sport = 'football';

		this.OddsStore = new OddsStore(this);
		this.ArbitrageStore = new ArbitrageStore(this);
		this.FixtureStore = new FixtureStore(this);
		this.FetchService2 = new FetchService2(this);

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
}

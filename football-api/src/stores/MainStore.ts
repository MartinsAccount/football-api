import { flow, observable } from 'mobx';
import { LEAGUES } from '../models/constants';
import { DataService } from '../services/DataService';

export class MainStore {
	@observable test: boolean = false;

	private DataService: DataService;

	constructor() {
		this.DataService = new DataService();
	}

	testFetch = flow(function* (this: MainStore) {
		// const curRound = yield this.DataService.GetCurrentRound(LEAGUES.ENGLAND);
		// const response = yield this.DataService.GetFixtures(LEAGUES.ENGLAND);
		const response = yield this.DataService.GetCurrentFixtures(LEAGUES.ENGLAND);
		// const response = yield this.DataService.GetOdds(LEAGUES.ENGLAND);
		// const response = yield this.DataService.GetStatistics(710559);

		// console.log(curRound);
		console.log(response);
		// console.log(JSON.stringify(response));
	});
}

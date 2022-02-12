// import { API_KEY, API_KEY_GINA, API_KEY3 } from '../core/constants/constants';
import { MainStore } from '../stores/MainStore';

type ISports = 'football' | 'baseball' | 'basketball';

export class FetchService2 {
	/* private myHeaders = new Headers(); */
	public requestNumber = 0;

	public MainStore: MainStore;

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;
	}

	public async get(url: string, sport: ISports = 'football') {
		let myHeaders = new Headers();

		const API_KEY = '91b0609029c3b070f6c0de0c6e7c8950';
		const API_KEY_GINA = '4aa4db2cf2cad515253c1a2b0fc662a3';

		this.MainStore.ArbitrageStore.increaseFetchNumber();

		if (sport === 'football') myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');
		if (sport === 'basketball') myHeaders.append('x-rapidapi-host', 'v1.basketball.api-sports.io');
		if (sport === 'baseball') myHeaders.append('x-rapidapi-host', 'v1.baseball.api-sports.io');

		if (this.MainStore.ArbitrageStore.fetchNumber < 3) {
			myHeaders.append('x-rapidapi-key', API_KEY);
		} else {
			myHeaders.append('x-rapidapi-key', API_KEY_GINA);
		}

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		let result = null;

		result = await fetch(url, requestOptions);
		this.requestNumber += 1;
		console.log('result', result);

		if (result.ok) return result.json();
		throw result;
	}

	// TODO: body type
	public async post(url: string, body: any) {
		try {
			const requestOptions: RequestInit = {
				method: 'POST',
				mode: 'cors' as RequestMode,
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				}
			};

			let result = null;

			result = await fetch(url, requestOptions);

			if (result.ok) return result.json();
			throw result;
		} catch (e) {
			console.log(e);
		}
	}
}

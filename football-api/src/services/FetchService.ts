import { MainStore } from '../stores/MainStore';

type ISports = 'football' | 'baseball' | 'basketball';

export class FetchService {
	public MainStore: MainStore;

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;

		console.log('constructor');
		console.log('this.MainStore.fetchNumber', this.MainStore.fetchNumber);
	}

	public async get(url: string, sport: ISports = 'football') {
		let myHeaders = new Headers();

		// const API_KEY = '91b0609029c3b070f6c0de0c6e7c8950'; //! Felfüggesztett
		const API_KEY_GINA = '03b42b2fc40a33be1db3bc0bed500095';
		const API_KEY_ARTI = 'b4d77835ab635fee8c4f41232238a12e';
		const API_KEY_DOKI = '71c2c7f80df5560417830a80ed2cc2cd';

		this.MainStore.increaseFetchNumber();
		// console.log('this.MainStore.fetchNumber', this.MainStore.fetchNumber);

		if (sport === 'football') myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');
		if (sport === 'basketball') myHeaders.append('x-rapidapi-host', 'v1.basketball.api-sports.io');
		if (sport === 'baseball') myHeaders.append('x-rapidapi-host', 'v1.baseball.api-sports.io');

		if (this.MainStore.fetchNumber < 90) {
			// console.log('API_KEY_GINA', API_KEY_GINA);
			myHeaders.append('x-rapidapi-key', API_KEY_GINA);
		}
		if (this.MainStore.fetchNumber > 90 && this.MainStore.fetchNumber < 185) {
			myHeaders.append('x-rapidapi-key', API_KEY_ARTI);
		}
		if (this.MainStore.fetchNumber > 185 && this.MainStore.fetchNumber < 285) {
			myHeaders.append('x-rapidapi-key', API_KEY_DOKI);
		}

		if (this.MainStore.fetchNumber > 260) this.MainStore.isLoading = false;

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		let result = null;

		result = await fetch(url, requestOptions);

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

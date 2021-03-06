import { API_KEY } from '../core/constants/constants';

type ISports = 'football' | 'baseball' | 'basketball';

class FetchService {
	// private myHeaders = new Headers();

	constructor() {
		// this.myHeaders.append('x-rapidapi-key', API_KEY);
	}

	public async get(url: string, sport: ISports = 'football') {
		let myHeaders = new Headers();

		const API_KEY = '91b0609029c3b070f6c0de0c6e7c8950';
		const API_KEY_GINA = '4aa4db2cf2cad515253c1a2b0fc662a3';

		if (sport === 'football') myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');
		if (sport === 'basketball') myHeaders.append('x-rapidapi-host', 'v1.basketball.api-sports.io');
		if (sport === 'baseball') myHeaders.append('x-rapidapi-host', 'v1.baseball.api-sports.io');

		myHeaders.append('x-rapidapi-key', API_KEY);

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

export default new FetchService();

import { API_KEY } from '../core/constants/constants';

type ISports = 'football' | 'baseball' | 'basketball';

class FetchService {
	private myHeaders = new Headers();
	public requestNumber = 0;

	constructor() {
		this.myHeaders.append('x-rapidapi-key', API_KEY);
	}

	public async get(url: string, sport: ISports = 'football') {
		if (sport === 'football') this.myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');
		if (sport === 'basketball') this.myHeaders.append('x-rapidapi-host', 'v1.basketball.api-sports.io');
		if (sport === 'baseball') this.myHeaders.append('x-rapidapi-host', 'v1.baseball.api-sports.io');

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: this.myHeaders,
			redirect: 'follow'
		};

		let result = null;

		result = await fetch(url, requestOptions);
		this.requestNumber += 1;

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

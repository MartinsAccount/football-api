import { API_KEY, CURRENT_SEASON, LEAGUES, UNIBET } from '../core/constants/constants';
import ApiURLs from './ApiURLs';

type ISports = 'football' | 'baseball' | 'basketball';

class FetchService {
	private myHeaders = new Headers();

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

		if (result.ok) return result.json();
		throw result;
	}

	public async PostDatas(body?: any) {
		try {
			// const bodyString = JSON.stringify(body);

			const fetchOptions = {
				method: 'POST',
				mode: 'cors' as RequestMode,
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json'
				}
			};

			const response = await fetch('http://localhost:5000/saveData', fetchOptions);

			return response.json();
		} catch (e) {
			console.log(e);
		}
	}
}

export default new FetchService();

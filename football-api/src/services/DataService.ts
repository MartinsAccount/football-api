import { API_KEY, UNIBET } from '../models/constants';

export class DataService {
	private myHeaders = new Headers();

	private url = 'https://v3.football.api-sports.io';
	private requestOptions: RequestInit = {
		method: 'GET',
		headers: this.myHeaders,
		redirect: 'follow'
	};

	constructor() {
		this.myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');
		this.myHeaders.append('x-rapidapi-key', API_KEY);
	}

	public async GetCurrentSeasonFixtures(leaguesId: number) {
		try {
			const response = await fetch(`${this.url}/fixtures?season=2021&league=${leaguesId}`, this.requestOptions);

			return response.json();
		} catch (e) {
			console.log(e);
		}
	}
	public async GetCustomSeasonFixtures(season: number, leaguesId: number) {
		try {
			const response = await fetch(`${this.url}/fixtures?season=${season}&league=${leaguesId}`, this.requestOptions);

			return response.json();
		} catch (e) {
			console.log(e);
		}
	}
	public async GetLeagues() {
		try {
			const response = await fetch(`${this.url}/leagues?country=Italy`, this.requestOptions);

			return response.json();
		} catch (e) {
			console.log(e);
		}
	}

	// response.response [{meccs1}, {meccs2}]
	// {} => {}.fixture.id
	public async GetCurrentRoundFixtures(leaguesId: number) {
		try {
			const round = await this.GetCurrentRound(leaguesId);

			const response = await fetch(`${this.url}/fixtures?season=2021&league=${leaguesId}&round=${round}`, this.requestOptions);

			return response.json();
		} catch (e) {
			console.log(e);
		}
	}

	public async GetCurrentRound(leaguesId: number) {
		try {
			const response = await fetch(
				`${this.url}/fixtures/rounds?season=2021&league=${leaguesId}&current=true`,
				this.requestOptions
			);

			const responseJson = await response.json();
			const round = responseJson.response[0];

			return round;
		} catch (e) {
			console.log(e);
		}
	}

	public async GetStatistics(fixtureId: number) {
		try {
			const response = await fetch(`${this.url}/fixtures/statistics?fixture=${fixtureId}`, this.requestOptions);

			const responseJson = await response.json();
			const round = responseJson.response[0];

			return round;
		} catch (e) {
			console.log(e);
		}
	}

	// response.response az egy array 10 elemmel (10 meccs a fordulóban)
	// egy elem => {}.fixture.id => meccs kód; innen lekell kérni nyílván hogy ez melyik meccs
	// egy elem => {}.bookmakers => tömb[{}] de mivel csak unibetre kértem le ezért mehet a => {}.bookmakers[0]
	// {}.bookmakers[0].bets => fogadások tömbje
	// tömb elemei objectek => {id: 2, name: "Home/Away", values: [{value: "Home", odd: "4.10"}, {value: "Away", odd: "1.25"}]}
	// TODO: Legfontosabbakat meghatározni
	// TODO: Odd határok megállapítása (pl.: low, mid, high)

	//? Meccs előtt és után is le kell kérni majd adatbázisba json-be menteni a lényeges adatokat pl:
	//? ligák szerint => bejött-e a papírforma / mennyi döntetlen / mindkét csapat gól / több v kevesebb mint x gól
	// nodeJS => adott fixtures mellé elmentem az oddsokat és később a fixture (meccs) adatait letudom kérni ismét

	public async GetOdds(leaguesId: number) {
		try {
			const response = await fetch(`${this.url}/odds?season=2021&league=${leaguesId}&bookmaker=${UNIBET}`, this.requestOptions);

			return response.json();
		} catch (e) {
			console.log(e);
		}
	}
}

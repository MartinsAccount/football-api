import { API_KEY, CURRENT_SEASON, LEAGUES, UNIBET } from '../core/constants/constants';
import ApiURLs from './ApiURLs';
import FetchService from './FetchService';

type ILeagues = keyof typeof LEAGUES;

class DataService {
	private myHeaders = new Headers();

	private url = 'https://v3.football.api-sports.io';
	private requestOptions: RequestInit = {
		method: 'GET',
		headers: this.myHeaders,
		redirect: 'follow'
	};

	constructor(/* sport: string */) {
		// if (sport === 'football') {
		this.myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');
		this.myHeaders.append('x-rapidapi-key', API_KEY);
		// }
	}

	public async get(url: string) {
		const myHeaders = new Headers();

		myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');
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
	public GetCurrentSeasonFixtures(leaguesId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_CURRENT_SEASON_FIXTURES(leaguesId));
	}
	public GetTodaysFixtures() {
		return FetchService.get(ApiURLs.FOOTBALL.GET_TODAYS_FIXTURES('2021-09-28'));
	}
	public GetUefaChampionsLeagueFixtures() {
		return FetchService.get(ApiURLs.FOOTBALL.GET_UEFA_CHAMPIONS_LEAGUE_FIXTURES('2021-09-28', '2021-09-29'));
	}
	public GetAllBookmakersOdds(fixture: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_ALL_BOOKMAKERS_ODDS(fixture, LEAGUES.UEFA_Champions_League));
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

			const response = await fetch(
				`${this.url}/fixtures?season=${CURRENT_SEASON}&league=${leaguesId}&round=${round}`,
				this.requestOptions
			);

			return response.json();
		} catch (e) {
			console.log(e);
		}
	}

	public async GetCurrentRound(leaguesId: number) {
		try {
			const response = await fetch(
				`${this.url}/fixtures/rounds?season=${CURRENT_SEASON}&league=${leaguesId}&current=true`,
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

	public async GetHighestOdds(leaguesId: number, fixture: number) {
		try {
			const bookmakers = await fetch(`${this.url}/odds/bookmakers`, this.requestOptions);
			// const odds = await fetch(
			// 	`${this.url}/odds?season=2021&bet=1&bookmaker=${bookmaker}&fixture=${fixture}&league=${leaguesId}`,
			// 	this.requestOptions
			// );
			const AllBookmakersodds = await fetch(
				`${this.url}/odds?season=2021&bet=1&fixture=${fixture}&league=${leaguesId}`,
				this.requestOptions
			);

			let highestHome = { bookmaker: '', odd: 0 };
			let highestDraw = { bookmaker: '', odd: 0 };
			let highestAway = { bookmaker: '', odd: 0 };

			console.log('allBookmakersOdds', AllBookmakersodds);

			const jsonData = await AllBookmakersodds.json();

			const allBookmakers = jsonData.response[0].bookmakers;

			console.log('allBookmakers', allBookmakers);

			allBookmakers.forEach((bookmaker) => {
				//* bookmaker/homeOdd
				if (Number(bookmaker.bets[0].values[0].odd) > highestHome.odd) {
					highestHome.odd = bookmaker.bets[0].values[0].odd;
					highestHome.bookmaker = bookmaker.name;
				}
				//* bookmaker/drawOdd
				if (Number(bookmaker.bets[0].values[1].odd) > highestDraw.odd) {
					highestDraw.odd = bookmaker.bets[0].values[1].odd;
					highestDraw.bookmaker = bookmaker.name;
				}
				//* bookmaker/awayOdd
				if (Number(bookmaker.bets[0].values[2].odd) > highestAway.odd) {
					highestAway.odd = bookmaker.bets[0].values[2].odd;
					highestAway.bookmaker = bookmaker.name;
				}
			});

			const hihghestOdds = [];
			hihghestOdds.push(highestHome);
			hihghestOdds.push(highestDraw);
			hihghestOdds.push(highestAway);

			return hihghestOdds;
		} catch (e) {
			console.log(e);
		}
	}
	public async GetHighestBaseballOdds() {
		const myHeaders = new Headers();
		const url = 'https://v1.baseball.api-sports.io';
		const requestOptions: RequestInit = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};
		myHeaders.append('x-rapidapi-host', 'v1.baseball.api-sports.io');
		myHeaders.append('x-rapidapi-key', API_KEY);

		// const bookmakers = await fetch(`${url}/bookmakers`, requestOptions);

		//71235 71234 69948 69949 71236 71237 66514 66509 66510 66511 66512 66513 71032 71033
		const game = 69949;

		let highestHome = { bookmaker: '', odd: 0 };
		let highestAway = { bookmaker: '', odd: 0 };

		const AllBookmakersodds = await fetch(`${url}/odds?bet=1&game=${game}`, requestOptions);
		console.log('allBookmakersOdds', AllBookmakersodds);

		const jsonData = await AllBookmakersodds.json();

		if (jsonData.response[0].bookmakers) {
			const allBookmakers = jsonData.response[0].bookmakers;

			console.log('allBookmakers', allBookmakers);

			allBookmakers.forEach((bookmaker) => {
				//* bookmaker/homeOdd
				if (Number(bookmaker.bets[0].values[0].odd) > highestHome.odd) {
					highestHome.odd = bookmaker.bets[0].values[0].odd;
					highestHome.bookmaker = bookmaker.name;
				}
				//* bookmaker/AwayOdd
				if (Number(bookmaker.bets[0].values[1].odd) > highestAway.odd) {
					highestAway.odd = bookmaker.bets[0].values[1].odd;
					highestAway.bookmaker = bookmaker.name;
				}
			});

			const hihghestOdds = [];
			hihghestOdds.push(highestHome);
			hihghestOdds.push(highestAway);

			return hihghestOdds;
		}

		return 'nincs találat';
		// const AllBookmakersodds = await fetch(`${url}/odds?bet=1fixture=${game}`, requestOptions);

		// const games = await fetch(`${url}/games?date=2021-09-27`, requestOptions);

		// return bookmakers.json();
	}
	public async GetHighestBasketballOdds() {
		const myHeaders = new Headers();
		const url = 'https://v1.basketball.api-sports.io';
		const requestOptions: RequestInit = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};
		myHeaders.append('x-rapidapi-host', 'v1.basketball.api-sports.io');
		myHeaders.append('x-rapidapi-key', API_KEY);

		// const bookmakers = await fetch(`${url}/bookmakers`, requestOptions);

		// 129030 129041 129127 129128 139568 139569 139570 139571 139572 142143 133290 142141 142142 142187 142188
		const game = 129030;

		let highestHome = { bookmaker: '', odd: 0 };
		let highestAway = { bookmaker: '', odd: 0 };

		const AllBookmakersodds = await fetch(`${url}/odds?bet=1&game=${game}`, requestOptions);
		console.log('allBookmakersOdds', AllBookmakersodds);

		const jsonData = await AllBookmakersodds.json();
		console.log('jsonData', jsonData);
		const allBookmakers = jsonData.response[0].bookmakers;

		console.log('allBookmakers', allBookmakers);

		allBookmakers.forEach((bookmaker) => {
			//* bookmaker/homeOdd
			if (Number(bookmaker.bets[0].values[0].odd) > highestHome.odd) {
				highestHome.odd = bookmaker.bets[0].values[0].odd;
				highestHome.bookmaker = bookmaker.name;
			}
			//* bookmaker/AwayOdd
			if (Number(bookmaker.bets[0].values[1].odd) > highestAway.odd) {
				highestAway.odd = bookmaker.bets[0].values[1].odd;
				highestAway.bookmaker = bookmaker.name;
			}
		});

		const hihghestOdds = [];
		hihghestOdds.push(highestHome);
		hihghestOdds.push(highestAway);

		// const AllBookmakersodds = await fetch(`${url}/odds?bet=1fixture=${game}`, requestOptions);
		// const games = await fetch(`${url}/games?date=2021-09-28`, requestOptions);

		// return bookmakers.json();
		return hihghestOdds;
	}
}

export default new DataService();

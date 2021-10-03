import { CURRENT_SEASON, LEAGUES, UNIBET } from '../core/constants/constants';

class ApiURLs {
	private readonly urls = null;
	private readonly backend = 'http://localhost:5000';

	constructor() {
		this.urls = {
			basketball: 'https://v1.basketball.api-sports.io',
			football: 'https://v3.football.api-sports.io',
			baseball: 'https://v1.baseball.api-sports.io'
		};
	}

	FOOTBALL = {
		GET_CURRENT_SEASON_FIXTURES: (leaguesId: number) =>
			`${this.urls.football}/fixtures?season=${CURRENT_SEASON}&league=${leaguesId}`,
		GET_TODAY_FIXTURES: (day: string) => `${this.urls.football}/fixtures?date=${day}`,
		GET_UEFA_CHAMPIONS_LEAGUE_FIXTURES: (from: string, to: string) =>
			`${this.urls.football}/fixtures?league=${LEAGUES.UEFA_Champions_League}&from=${from}&to=${to}&season=${CURRENT_SEASON}`,
		GET_UEFA_EUROPA_LEAGUE_FIXTURES: (date: string) =>
			`${this.urls.football}/fixtures?league=${LEAGUES.UEFA_Europa_League}&date=${date}&season=${CURRENT_SEASON}`,
		GET_ALL_BOOKMAKERS_ODDS: (fixture: number, leaguesId?: number) =>
			`${this.urls.football}/odds?season=2021&bet=1&fixture=${fixture}`,
		GET_CUSTOM_SEASON_FIXTURES: (season: number, leaguesId: number) =>
			`${this.urls.football}/fixtures?season=${season}&league=${leaguesId}`,
		GET_LEAGUES: (country: string) => `${this.urls.football}/leagues?country=${country}`,
		GET_CURRENT_ROUND_FIXTURES: (leaguesId: number, round: string) =>
			`${this.urls.football}/fixtures?season=${CURRENT_SEASON}&league=${leaguesId}&round=${round}`,
		GET_CURRENT_ROUND: (leaguesId: number) =>
			`${this.urls.football}/fixtures/rounds?season=${CURRENT_SEASON}&league=${leaguesId}&current=true`,
		GET_FIXTURE_STATISTICS: (fixtureId: number) => `${this.urls.football}/fixtures/statistics?fixture=${fixtureId}`,
		//* Odds-ok
		GET_UNIBET_ODDS: (leaguesId: number) => `${this.urls.football}/odds?season=2021&league=${leaguesId}&bookmaker=${UNIBET}`,
		GET_BOOKMAKERS: () => `${this.urls.football}/odds/bookmakers`
	};

	BACKEND = {
		SAVE_ODDS: (country?: string) => `${this.backend}/api/saveOdds?country=${country}`
	};

	BASEBALL = {};

	BASKETBALL = {};
}

export default new ApiURLs();

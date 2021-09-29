import { CURRENT_SEASON, LEAGUES } from '../core/constants/constants';

class ApiURLs {
	private readonly urls = null;

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
			`${this.urls.football}/odds?season=2021&bet=1&fixture=${fixture}`
	};

	BASEBALL = {};

	BASKETBALL = {};
}

export default new ApiURLs();

// interface IAppSettings {
// 	Urls: ApiURLs;
// }

// export const AppSettings: IAppSettings = {
// 	Urls: null
// };

import { LEAGUES } from '../../../core/constants/constants';
import ApiURLs from '../../../services/ApiURLs';
import FetchService from '../../../services/FetchService';

type ILeagues = keyof typeof LEAGUES;

class OddsService {
	public GetAllBookmakersOdds(fixture: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_ALL_BOOKMAKERS_ODDS(fixture));
	}

	public GetUnibetOdds(leaguesId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_UNIBET_ODDS(leaguesId));
	}

	public GetAvailableFixtures(page: number = 1) {
		return FetchService.get(ApiURLs.FOOTBALL.AVAILABLE_FIXTURES_FOR_ODDS(page));
	}

	public GetBookmakers() {
		return FetchService.get(ApiURLs.FOOTBALL.GET_BOOKMAKERS());
	}

	public GetLeagueOdds(leaguesId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_LEAGUE_ODDS(leaguesId));
	}

	//! Backend
	public GetSavedOdds() {
		return FetchService.get(ApiURLs.BACKEND.GET_SAVED_ODDS());
	}

	//* POST requests
	public saveOdds(body: any, country?: string) {
		return FetchService.post(ApiURLs.BACKEND.SAVE_ODDS(country), body);
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

	public async GetHighestBaseballOdds() {
		// const AllBookmakersodds = await fetch(`${url}/odds?bet=1&game=${game}`, requestOptions);
		// const AllBookmakersodds = await fetch(`${url}/odds?bet=1fixture=${game}`, requestOptions);
		// const games = await fetch(`${url}/games?date=2021-09-27`, requestOptions);
		//TODO: Logika ugyanaz mint az arbitrage store football-ra csak két kimentel van
	}
	public async GetHighestBasketballOdds() {
		// const bookmakers = await fetch(`${url}/bookmakers`, requestOptions);
		// const AllBookmakersodds = await fetch(`${url}/odds?bet=1&game=${game}`);
		//TODO: Logika ugyanaz mint az arbitrage store football-ra csak két kimentel van
	}
}

export default new OddsService();

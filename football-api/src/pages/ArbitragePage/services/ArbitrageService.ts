import { LEAGUES } from '../../../core/constants/constants';
import ApiURLs from '../../../services/ApiURLs';
import FetchService from '../../../services/FetchService';

type ILeagues = keyof typeof LEAGUES;

class ArbitrageService {
	public GetCurrentRound(leaguesId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_CURRENT_ROUND(leaguesId));
	}

	public GetAvailableFixtures(page: number = 1) {
		return FetchService.get(ApiURLs.FOOTBALL.AVAILABLE_FIXTURES_FOR_ODDS(page));
	}

	public GetLeagueOdds(leaguesId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_LEAGUE_ODDS(leaguesId));
	}
}

export default new ArbitrageService();

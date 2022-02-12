import { LEAGUES } from '../../../core/constants/constants';
import ApiURLs from '../../../services/ApiURLs';
import FetchService from '../../../services/FetchService3';

type ILeagues = keyof typeof LEAGUES;

class FixtureService {
	public GetCurrentSeasonFixtures(leaguesId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_CURRENT_SEASON_FIXTURES(leaguesId));
	}

	public GetFixture(fixtureId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_FIXTURE(fixtureId));
	}

	public async GetTodayFixtures() {
		const response = await FetchService.get(ApiURLs.FOOTBALL.GET_TODAY_FIXTURES('2021-10-06'));
		console.log(response);
		console.log(JSON.stringify(response));
	}

	public GetUefaChampionsLeagueFixtures() {
		return FetchService.get(ApiURLs.FOOTBALL.GET_UEFA_CHAMPIONS_LEAGUE_FIXTURES('2021-09-28', '2021-09-29'));
	}

	public GetUefaEuropaLeagueFixtures() {
		return FetchService.get(ApiURLs.FOOTBALL.GET_UEFA_EUROPA_LEAGUE_FIXTURES('2021-09-30'));
	}

	public GetCustomSeasonFixtures(season: number, leaguesId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_CUSTOM_SEASON_FIXTURES(season, leaguesId));
	}

	public async GetLeagues() {
		const response = await FetchService.get(ApiURLs.FOOTBALL.GET_LEAGUES());
		console.log(response);
		console.log(JSON.stringify(response));
	}

	public async GetCurrentRoundFixtures(leaguesId: number) {
		const round = await this.GetCurrentRound(leaguesId);

		return FetchService.get(ApiURLs.FOOTBALL.GET_CURRENT_ROUND_FIXTURES(leaguesId, round));
	}

	public GetCurrentRound(leaguesId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_CURRENT_ROUND(leaguesId));
	}

	public GetFixtureStatistics(fixtureId: number) {
		return FetchService.get(ApiURLs.FOOTBALL.GET_FIXTURE_STATISTICS(fixtureId));
	}

	public GetAvailableFixtures(page: number = 1) {
		return FetchService.get(ApiURLs.FOOTBALL.AVAILABLE_FIXTURES_FOR_ODDS(page));
	}
}

export default new FixtureService();

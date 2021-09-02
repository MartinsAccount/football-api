import { computed, flow, observable, toJS } from 'mobx';
import { LEAGUES } from '../models/constants';
import { Fixture, Fixtures } from '../models/models';
import { DataService } from '../services/DataService';
import { OddsStore } from './OddsStore';

type Countries = 'england' | 'germany' | 'france' | 'spain' | 'italy';

interface currentFixture {
	[key: string]: Fixture[];
}
export class MainStore {
	public OddsStore: OddsStore;
	public DataService: DataService;

	@observable currentFixtures: currentFixture = {
		england: null,
		germany: null,
		italy: null,
		france: null,
		spain: null
	};

	@observable fixtures: Fixture[];
	@observable results: number = 0;

	constructor() {
		this.DataService = new DataService();
		this.OddsStore = new OddsStore(this);

		this.OddsStore.Init();
	}

	Init = flow(function* (this: MainStore) {
		const englandFixtures = yield this.DataService.GetCurrentSeasonFixtures(LEAGUES.ENGLAND);
		const germanyFixtures = yield this.DataService.GetCurrentSeasonFixtures(LEAGUES.GERMANY);
		const franceFixtures = yield this.DataService.GetCurrentSeasonFixtures(LEAGUES.FRANCE);
		const spainFixtures = yield this.DataService.GetCurrentSeasonFixtures(LEAGUES.SPAIN);
		const italyFixtures = yield this.DataService.GetCurrentSeasonFixtures(LEAGUES.ITALY);

		this.currentFixtures.england = englandFixtures.response;
		this.currentFixtures.germany = germanyFixtures.response;
		this.currentFixtures.france = franceFixtures.response;
		this.currentFixtures.spain = spainFixtures.response;
		this.currentFixtures.italy = italyFixtures.response;
	});

	leaguesStatistics = flow(function* (this: MainStore, country: Countries) {
		let _fixtures: Fixtures;

		switch (country) {
			case 'england':
				_fixtures = yield require('../data/allMatchPremierLeague_2020.json');
				break;
			case 'germany':
				_fixtures = yield require('../data/allMatchBundesliga_2020.json');
				break;
			case 'spain':
				_fixtures = yield require('../data/allMatchLaLiga_2020.json');
				break;
			case 'italy':
				_fixtures = yield require('../data/allMatchSeriaA_2020.json');
				break;
			case 'france':
				_fixtures = yield require('../data/allMatchFrance_2020.json');
		}

		this.fixtures = _fixtures.response;
		this.results = _fixtures.results;

		console.log('fixtures', toJS(this.fixtures));
	});

	//TODO: Odds nélküli
	//? Mennyi gól összesen
	//? Mennyi meccs ahol mindkét csapat gól
	//? Mennyi gól az első félidőkben
	//? Mennyi gól a második félidőkben
	//? Melyik félidőkben van több gól
	//? Mennyi döntetlen
	//? Mennyi hazai győzelem
	//? Gólok száma páros vagy páratlan

	//? Volt e mindegyik csapatnak legalább 1 döntetlene?

	@computed get getAllGoals() {
		const allGoals = this.fixtures
			.map((fixture) => {
				let homeGoal = fixture.goals.home;
				let awayGoal = fixture.goals.away;

				return homeGoal + awayGoal;
			})
			.reduce((prev, cur) => prev + cur);

		return allGoals;
	}

	@computed get bothTeamsScore() {
		let number = 0;

		this.fixtures.map((fixture) => {
			if (fixture.goals.home > 0 && fixture.goals.away > 0) {
				number += 1;
			}
			return null;
		});

		return number;
	}
	@computed get getFirstHalfGoals() {
		const allGoals = this.fixtures
			.map((fixture) => {
				let homeGoal = fixture.score.halftime.home;
				let awayGoal = fixture.score.halftime.away;

				return homeGoal + awayGoal;
			})
			.reduce((prev, cur) => prev + cur);

		return allGoals;
	}
	@computed get getSecondHalfGoals() {
		return this.getAllGoals - this.getFirstHalfGoals;
	}
	@computed get getDrawFixtures() {
		let drawNumber = 0;

		this.fixtures.map((fixture) => {
			if (fixture.goals.home === fixture.goals.away && fixture.goals.home !== null) {
				drawNumber += 1;
			}
			return null;
		});

		return drawNumber;
	}
	@computed get getHomeWinners() {
		let homeWinnersNumber = 0;

		this.fixtures.map((fixture) => {
			if (fixture.goals.home > fixture.goals.away) {
				homeWinnersNumber += 1;
			}
			return null;
		});

		return homeWinnersNumber;
	}
	@computed get getOddGoals() {
		let oddNumber = 0;

		this.fixtures.map((fixture) => {
			let homeGoal = fixture.goals.home;
			let awayGoal = fixture.goals.away;

			if ((homeGoal + awayGoal) % 2 === 1) {
				oddNumber += 1;
			}

			return null;
		});

		return oddNumber;
	}
	@computed get getEvenGoals() {
		let evenNumber = 0;

		this.fixtures.map((fixture) => {
			let homeGoal = fixture.goals.home;
			let awayGoal = fixture.goals.away;

			if ((homeGoal + awayGoal) % 2 === 0) {
				evenNumber += 1;
			}

			return null;
		});

		return evenNumber;
	}
	@computed get getAllFixtures() {
		let fixtureNumber = 0;

		this.fixtures.map((fixture) => {
			if (fixture.goals.home !== null) {
				fixtureNumber += 1;
			}

			return null;
		});

		return fixtureNumber;
	}

	testFetch = flow(function* (this: MainStore) {
		// const curRound = yield this.DataService.GetCurrentRound(LEAGUES.ENGLAND);
		// const response = yield this.DataService.GetCustomSeasonFixtures(2020, LEAGUES.ITALY);
		// const response = yield this.DataService.GetCurrentRoundFixtures(LEAGUES.ENGLAND);
		const response = yield this.DataService.GetCurrentSeasonFixtures(LEAGUES.ENGLAND);
		// const response = yield this.DataService.GetOdds(LEAGUES.ENGLAND);
		// const response = yield this.DataService.GetStatistics(710559);

		// const response = yield this.DataService.GetLeagues();
		// console.log(curRound);
		console.log(response);
		console.log(JSON.stringify(response));

		this.fixtures = response.response;
		this.results = response.results;
	});
}

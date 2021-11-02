import { computed, flow, observable, toJS } from 'mobx';
import { LEAGUES } from '../../../core/constants/constants';
import { Fixture, Fixtures } from '../../../core/models/models';
import FixtureService from '../services/FixtureService';
import { MainStore } from '../../../stores/MainStore';

type Countries = 'england' | 'germany' | 'france' | 'spain' | 'italy' | 'all';

interface currentFixture {
	[key: string]: Fixture[];
}
export class FixtureStore {
	public MainStore: MainStore;

	@observable currentFixtures: currentFixture = {
		england: null,
		germany: null,
		italy: null,
		france: null,
		spain: null
	};

	@observable fixtures: Fixture[];
	@observable results: number = 0;
	@observable currentLeague: string;

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;
	}

	Init = flow(function* (this: FixtureStore) {
		const englandFixtures = yield FixtureService.GetCurrentSeasonFixtures(LEAGUES.ENGLAND);
		const germanyFixtures = yield FixtureService.GetCurrentSeasonFixtures(LEAGUES.GERMANY);
		const franceFixtures = yield FixtureService.GetCurrentSeasonFixtures(LEAGUES.FRANCE);
		const spainFixtures = yield FixtureService.GetCurrentSeasonFixtures(LEAGUES.SPAIN);
		const italyFixtures = yield FixtureService.GetCurrentSeasonFixtures(LEAGUES.ITALY);

		this.currentFixtures.england = englandFixtures.response;
		this.currentFixtures.germany = germanyFixtures.response;
		this.currentFixtures.france = franceFixtures.response;
		this.currentFixtures.spain = spainFixtures.response;
		this.currentFixtures.italy = italyFixtures.response;
	});

	leaguesStatistics = flow(function* (this: FixtureStore, country: Countries) {
		let _fixtures: Fixtures;
		let _league: string;

		switch (country) {
			case 'england':
				_fixtures = yield require('../../../data/allMatchPremierLeague_2020.json');
				_league = 'Angol bajnokság';
				break;
			case 'germany':
				_fixtures = yield require('../../../data/allMatchBundesliga_2020.json');
				_league = 'Német bajnokság';
				break;
			case 'spain':
				_fixtures = yield require('../../../data/allMatchLaLiga_2020.json');
				_league = 'Spanyol bajnokság';
				break;
			case 'italy':
				_fixtures = yield require('../../../data/allMatchSeriaA_2020.json');
				_league = 'Olasz bajnokság';
				break;
			case 'france':
				_league = 'Francia bajnokság';
				_fixtures = yield require('../../../data/allMatchFrance_2020.json');
		}

		this.fixtures = _fixtures.response;
		this.results = _fixtures.results;
		this.currentLeague = _league;

		console.log('fixtures', toJS(this.fixtures));
	});

	//TODO: Odds nélküli
	//? Volt e mindegyik csapatnak legalább 1 döntetlene?
	//? Volt gól
	//? 1,5 gól felett

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

	@computed get overNullGoal() {
		let sumFixture = 0;

		this.fixtures.forEach((fixture) => {
			if (fixture.goals.home + fixture.goals.away > 0) sumFixture += 1;
		});

		return sumFixture;
	}

	@computed get overOneGoal() {
		let sumFixture = 0;

		this.fixtures.forEach((fixture) => {
			if (fixture.goals.home + fixture.goals.away > 1) sumFixture += 1;
		});

		return sumFixture;
	}
	@computed get overTwoGoal() {
		let sumFixture = 0;

		this.fixtures.forEach((fixture) => {
			if (fixture.goals.home + fixture.goals.away > 2) sumFixture += 1;
		});

		return sumFixture;
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

	@computed get teamsNumber() {
		let teams = [];

		this.fixtures.forEach((fixture) => {
			if (!teams.includes(fixture.teams.home.id) && !teams.includes(fixture.teams.away.id)) {
				teams.push(fixture.teams.home.id);
				teams.push(fixture.teams.away.id);
			}
		});

		return teams.length;
	}

	@computed get teamWithDraw() {
		let teamHasDraw = [];

		this.fixtures.forEach((fixture) => {
			if (
				fixture.goals.home === fixture.goals.away &&
				!teamHasDraw.includes(fixture.teams.home.id) &&
				!teamHasDraw.includes(fixture.teams.away.id)
			) {
				teamHasDraw.push(fixture.teams.home.id);
				teamHasDraw.push(fixture.teams.away.id);
			}
			return null;
		});

		return teamHasDraw.length;
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
}

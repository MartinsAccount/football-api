import { computed, flow, observable, toJS } from 'mobx';
import { LEAGUES } from '../../../core/constants/constants';
import { Fixture, Fixtures } from '../../../core/models/models';
import FixtureService from '../services/FixtureService';
import { MainStore } from '../../../stores/MainStore';

type Countries = 'england' | 'germany' | 'france' | 'spain' | 'italy';

interface currentFixture {
	[key: string]: Fixture[];
}
export class FixtureStore {
	// public OddsStore: OddsStore;
	// public ArbitrageStore: ArbitrageStore;
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

		switch (country) {
			case 'england':
				_fixtures = yield require('../../../data/allMatchPremierLeague_2020.json');
				break;
			case 'germany':
				_fixtures = yield require('../../../data/allMatchBundesliga_2020.json');
				break;
			case 'spain':
				_fixtures = yield require('../../../data/allMatchLaLiga_2020.json');
				break;
			case 'italy':
				_fixtures = yield require('../../../data/allMatchSeriaA_2020.json');
				break;
			case 'france':
				_fixtures = yield require('../../../data/allMatchFrance_2020.json');
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
}

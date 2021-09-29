import { action, computed, flow, observable, toJS } from 'mobx';
import { Fixture, OddsInfo, OddsResponse } from '../core/models/models';
import DataService from '../services/DataService';
import { MainStore } from './MainStore';

export class ArbitrageStore {
	public MainStore: MainStore;

	@observable testOdds: OddsResponse[];
	@observable testFixtures: Fixture[];

	constructor(MainStore: MainStore) {
		this.MainStore = MainStore;
	}
	// Init = flow(function* (this: ArbitrageStore) {
	// 	const testFixtures = yield require('../data/testCurrentFixtures_England2021.json');
	// 	this.testFixtures = testFixtures.response;
	// });

	//TODO: Arbrigate calc
	//TODO: Minden fogadóirodánál megkeresni a legnagyobb oddsot (H, D, V) esetekre
	getHighestOdds = flow(function* (this: MainStore) {
		// const bookmakers = yield DataService.GetHighestOdds();

		const { response } = yield DataService.GetUefaChampionsLeagueFixtures();
		// console.log('response', response);

		for (let index = 8; index < response.length; index++) {
			const fixtureId = response[index].fixture.id;
			const homeTeam = response[index].teams.home.name;
			const awayTeam = response[index].teams.away.name;
			// console.log('fixture', fixtureId);

			const currentFixtureOdds = yield DataService.GetAllBookmakersOdds(fixtureId);
			// console.log('currentFixtureOdds', currentFixtureOdds);

			const bookmakersArray = currentFixtureOdds.response[0].bookmakers;
			// console.log('bookmakersArray', bookmakersArray);

			let highestHome = { bookmaker: '', odd: 0 };
			let highestDraw = { bookmaker: '', odd: 0 };
			let highestAway = { bookmaker: '', odd: 0 };

			bookmakersArray.forEach((bookmaker) => {
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

			let arbitrageNumber = 0;

			hihghestOdds.forEach((item) => {
				arbitrageNumber += 1 / Number(item.odd);
			});

			console.log('----------MECCS:----------', `${homeTeam} vs ${awayTeam}`);
			console.log('----------Highest Odds----------', hihghestOdds);
			console.log('----------Arbitrage number----------', arbitrageNumber);
			console.log(
				`
			FINISHED 
			`
			);
		}
	});

	@action arbitrageCalculator(odd1: number, odd2: number, _stake1: number, _stake2?: number) {
		let bool = false;

		let win1 = 0;
		let win2 = 0;

		let stake1 = _stake1;
		let stake2 = _stake2 || _stake1 / 2;

		win1 = odd1 * stake1;
		win2 = odd2 * stake2;

		let sumWin = win1 + win2;
		let sumStake = stake1 + stake2;

		if (bool) {
			for (let i = 0; i < 20; i++) {}
		}

		if (sumStake < sumWin) {
			let profit1 = win1 - sumStake;
			let profit2 = win2 - sumStake;

			if (Math.abs(profit1 - profit2) > 400) {
				const newStake = stake2 + 200;

				this.arbitrageCalculator(odd1, odd2, stake1, newStake);
			}
		}
	}
}

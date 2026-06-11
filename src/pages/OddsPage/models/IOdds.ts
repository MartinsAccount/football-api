import { BetsNames } from './types';

export interface IOdds {
	england: IOddsItem;
	france: IOddsItem;
	germany: IOddsItem;
	italy: IOddsItem;
	spain: IOddsItem;
}

export interface IOddsItem {
	odds: ILeagueOddsResponse[];
}

export interface ILeagueOddsResponse {
	bookmakers: Bookmaker[];
	fixture: {
		date: string; // "2021-10-01T18:45:00+00:00"
		id: number; // fixtureId
		timezone: string;
		timestamp: string;
	};
	league: {
		country: string;
		id: number;
		name: string; // Seria A
		season: number; // 2021
	};
}

export interface Bookmaker {
	id: number;
	name: string; // Unibet, William Hill, Marathonbet, Betcris, Bet365, Bwin
	bets: Bet[];
}

export interface Bet {
	id: number;
	name: BetsNames;
	values: BetsValue[];
}

export interface BetsValue {
	value: string; // "Home"
	odd: string; // "1.9"
}

import { BetsNames } from './types';

export interface BetsValue {
	value: string; // "Home"
	odd: string; // "1.9"
}
export interface Bet {
	id: number;
	name: BetsNames;
	values: BetsValue[];
}
export interface Bookmaker {
	id: number;
	name: string; // Unibet, William Hill, Marathonbet, Betcris, Bet365, Bwin
	bets: Bet[];
}

export interface ILeagueOddsResponse {
	bookmakers: Bookmaker[];
	fixture: {
		date: string; // "2021-10-01T18:45:00+00:00"
		id: number; // fixtureId
	};
	league: {
		country: string;
		id: number;
		name: string; // Seria A
		season: number; // 2021
	};
}

export interface IOddsMappingResponse {
	fixture: {
		id: number;
		date: string;
		timestamp: number;
	};
	league: {
		id: number; //? ez kell
		season: number; //? lehet bármi nem biztos hogy === CURRENT SEASON-el
	};
	update: string; // date
}
export interface IOddsMapping {
	paging: {
		current: number;
		total: number;
	};
	response: IOddsMappingResponse[];
	results: number; //max 100 egy page-en
}

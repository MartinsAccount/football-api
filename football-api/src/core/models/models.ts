import { type } from 'os';

export type StatisticsType =
	| 'Shots on Goal'
	| 'Shots off Goal'
	| 'Total Shots'
	| 'Blocked Shots'
	| 'Shots insidebox'
	| 'Fouls'
	| 'Corner Kicks'
	| 'Offsides'
	| 'Ball Possession' // string
	| 'Yellow Cards'
	| 'Red Cards'
	| 'Goalkeeper Saves'
	| 'Passes accurate'
	| 'Passes %'; // string

export type BetsNames =
	| 'Match Winner' // Home, Draw, Away
	| 'Home/Away' // Home, Away
	| 'Second Half Winner' // Home, Draw, Away
	| 'Goals Over/Under' // "Over 1.5" // "Under 2.5" stb.
	| 'Goals Over/Under - First Half' // "Over 1.5" // "Under 2.5" stb.
	| 'Goals Over/Under - Second Half' // "Over 1.5" // "Under 2.5" stb.
	| 'HT/FT Double' // első félidő/végeredmény => pl: Home/Draw vagy Home/Away
	| 'Both Teams Score' // Yes No
	| 'Win to Nil - Home' // Yes No
	| 'Win to Nil - Away' // Yes No
	| 'Handicap Result' // "Home -1" , "Away +1", "Draw -3"
	| 'Exact Score' // "1:0" ,  "4:2" stb.
	| 'Correct Score - First Half' // pl: 1:0 , 3:1 , 5:0
	| 'Correct Score - Second Half' // pl: 1:0 , 3:1 , 5:0
	| 'Double Chance' // Home/Draw , Home/Away , Draw/Away
	| 'First Half Winner' // Home, Draw, Away
	| 'Total - Home' // gól pl.: 1,5 felett / alatt stb. => "Over 1.5" // "Under 2.5" stb.
	| 'Total - Away' // "Over 1.5" // "Under 2.5" stb.
	| 'Double Chance - First Half' // Home/Draw , Home/Away , Draw/Away
	| 'Double Chance - Second Half' // Home/Draw , Home/Away , Draw/Away
	| 'Both Teams Score - First Half' // Yes No
	| 'Both Teams To Score - Second Half' // Yes No
	| 'Odd/Even' // gólok száma párps-páratlan
	| 'Home Odd/Even' // Odd , Even
	| 'Away Odd/Even' // Odd , Even
	| 'Home win both halves' // Yes No
	| 'Away win both halves' // Yes No
	| 'Corners 1x2' // Home, Draw, Away
	| 'Corners Over Under'; // "Over 5.5" // "Under 7.5" stb.

export interface IBetsTypes {
	[key: string]: BetsNames;
}

export interface Statistics {
	type: StatisticsType;
	value: number | string;
}

export interface Fixture {
	fixture: {
		id: number; //!
		date: string;
	};
	goals: {
		home: number; //!
		away: number; //!
	};
	league: {
		id: number;
		name: string;
		country: string;
	};
	score: {
		halftime: { home: number; away: number };
		fulltime: { home: number; away: number };
		penalty: { home: number; away: number };
	};
	teams: {
		away: {
			id: number; //!
			name: string;
			winner: boolean;
			logo: string;
		};
		home: {
			id: number; //!
			name: string;
			winner: boolean;
			logo: string;
		};
	};
}

export interface Fixtures {
	parameters: {
		season: string;
		league: string;
		round: string;
	};
	response: Fixture[];
	results: number;
}
export interface BetsValue {
	value: string;
	odd: string;
}

export interface Bet {
	id: number;
	name: BetsNames;
	values: BetsValue[];
}

export interface OddsResponse {
	bookmakers: [
		{
			id: number;
			name: string; // Unibet
			bets: Bet[]; //!
		}
	];
	fixture: {
		id: number;
		timezone: string;
		date: string;
		timestamp: string;
	};
	league: {
		id: number;
		name: string;
		country: string;
		logo: string;
		flag: string;
		season: number;
	};
	update: string;
}

export class OddsInfo {
	favoriteWin: 0;
	unFavoriteWin: 0;
	smallOdd: {
		home: {
			sum: 0;
			win: 0;
			draw: 0;
			lose: 0;
		};
		away: {
			sum: 0;
			win: 0;
			draw: 0;
			lose: 0;
		};
	};
	midOdd: {
		home: {
			sum: 0;
			win: 0;
			draw: 0;
			lose: 0;
		};
		away: {
			sum: 0;
			win: 0;
			draw: 0;
			lose: 0;
		};
	};
	highOdd: {
		home: {
			sum: 0;
			win: 0;
			draw: 0;
			lose: 0;
		};
		away: {
			sum: 0;
			win: 0;
			draw: 0;
			lose: 0;
		};
	};
}

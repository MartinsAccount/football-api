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

export interface Statistics {
	type: StatisticsType;
	value: number | string;
}

export interface Match {
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
	response: Match[];
}

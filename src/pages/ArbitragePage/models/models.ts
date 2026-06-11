export interface IHighestOdds {
	name: string;
	bookmaker: string;
	odd: number;
}

export interface IArbitrage {
	name: string;
	highestOdds: IHighestOdds[];
	arbitrage: number;
	// betType: BetsNames
}

export interface IAnalyzedFixture {
	homeTeam?: string;
	awayTeam?: string;
	fixture: number;
	country: string;
	date: string;
	leagueName: string;
	arbitrages: IArbitrage[];
}

export type IFilters = 'goodArbitrage';

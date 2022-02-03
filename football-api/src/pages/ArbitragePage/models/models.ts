export interface IHighestOdds {
	name: string;
	bookmaker: string;
	odd: number;
}
export interface IAnalyzedResult {
	// betType: BetsNames;
	name: string;
	highestOdds: IHighestOdds[];
	arbitrage: number;
	// betType: BetsNames
}
export interface IAnalyzedElement {
	// betType: BetsNames;
	[key: string]: IAnalyzedResult;
}

export interface IArbitrage {
	homeTeam?: string;
	awayTeam?: string;
	fixture: number;
	country: string;
	date: string;
	leagueName: string;
	analyzed: IAnalyzedResult[];
	matchWinner?: IAnalyzedResult;
	homeAway?: IAnalyzedResult;
}

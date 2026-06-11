import { IAnalyzedFixture, IHighestOdds } from './models';

export interface IArbitrageByBetType {
	betType: string;
	arbitrage: number;
	bookmakers: IHighestOdds[];
	data: IAnalyzedFixture;
}

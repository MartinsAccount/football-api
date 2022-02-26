import { Fixture } from '../../FixturePage/models/models';

export interface IFixtures {
	england: Fixture[];
	france: Fixture[];
	germany: Fixture[];
	italy: Fixture[];
	spain: Fixture[];
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
	update: Date; // date
}
export interface IOddsMapping {
	paging: {
		current: number;
		total: number;
	};
	response: IOddsMappingResponse[];
	results: number; //max 100 egy page-en
}

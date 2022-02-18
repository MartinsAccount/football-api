export const API_KEY = '91b0609029c3b070f6c0de0c6e7c8950';
export const API_KEY_GINA = '4aa4db2cf2cad515253c1a2b0fc662a3';
export const API_KEY3 = ''; // TODO
// export const API_KEY = 'a75051c72cmsh270d3bec1aa20bcp1aa643jsn0af380613c7c';

export const CURRENT_SEASON = 2021;
export const UNIBET = 16;

// TODO: TOP bookmakerek kiválasztása ahol a legnagyobbak az oddsok
const BOOKMAKERS = [
	'Bwin',
	'NordicBet',
	'10Bet',
	'William Hill',
	'Bet365',
	'Marathonbet',
	'Unibet',
	'Betsson',
	'188Bet',
	'Pinnacle',
	'SBO',
	'Netbet',
	'1xBet',
	'Sportingbet',
	'ComeOn',
	'Betway',
	'Tipico',
	'Betcris',
	'888Sport',
	'Dafabet'
];

export enum LEAGUES {
	ENGLAND = 39,
	GERMANY = 78,
	FRANCE = 61,
	SPAIN = 140,
	ITALY = 135,
	UEFA_Champions_League = 2, // BL
	UEFA_Europa_League = 3, // EL
	UEFA_Nations_League = 5, // Nemzetek Ligája
	World_Cup_Africa = 29, // Afrika VB selejtező
	EURO_Championship = 4, // Európa bajnokság
	FIFA_World_Cup = 15, // Világbajnoksáág
	World_Cup = 1 // Világbajnokság
}

export enum BETS_TYPES {
	Vegeredmeny = 'Match Winner',
	HazaiVagyVendeg = 'Home/Away',
	ElsoFelidoVegeredmeny = 'First Half Winner',
	MasodikFelidoVegeredmeny = 'Second Half Winner',
	MindketCsapatGol = 'Both Teams Score',
	ElsoFelidoMindketCsapatGol = 'Both Teams Score - First Half',
	MasodikFelidoMindketCsapatGol = 'Both Teams To Score - Second Half',
	GolokSzama = 'Goals Over/Under', // {value: 'Over 3.5', odd: '2.55'},  {value: 'Under 4.5', odd: '1.20'}
	HazaiGolokSzama = 'Total - Home', // {value: 'Over 3.5', odd: '2.55'},  {value: 'Under 4.5', odd: '1.20'}
	VendegGolokSzama = 'Total - Away',
	ElsoFelidoGolokSzama = 'Goals Over/Under - First Half',
	MasodikFelidoGolokSzama = 'Goals Over/Under - Second Half',
	PontosVegeredmeny = 'Exact Score',
	ElsoFelidoPontosVegeredmeny = 'Correct Score - First Half',
	MasodikFelidoPontosVegeredmeny = 'Correct Score - Second Half',
	ParosParatlanGolszam = 'Odd/Even',
	HazaiParosParatlanGolszam = 'Home Odd/Even',
	VendegParosParatlanGolszam = 'Away Odd/Even', // {value: 'Odd', odd: '2.33'}, {value: 'Even', odd: '1.63'}
	HazaiMindketFelidoGyozelem = 'Home win both halves', // {value: 'Yes', odd: '3.30'}, {value: 'No', odd: '1.28'}
	VendegMindketFelidoGyozelem = 'Away win both halves',
	SzogletekSzama = 'Corners Over Under',
	SzogletekVegeredmeny = 'Corners 1x2',
	KeteselyesVegeredmeny = 'Double Chance',
	KeteselyesElsoFelidoVegeredmeny = 'Double Chance - First Half',
	KeteselyesMasodikFelidoVegeredmeny = 'Double Chance - Second Half',
	VegeredmenyHandicap = 'Handicap Result'
}

// | 'HT/FT Double' // első félidő/végeredmény => pl: Home/Draw vagy Home/Away
// | 'Win to Nil - Home' // Yes No
// | 'Win to Nil - Away' // Yes No

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

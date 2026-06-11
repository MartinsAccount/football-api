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

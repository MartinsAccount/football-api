const inside = {
	home: {
		sum: 0,
		win: 0,
		draw: 0,
		lose: 0
	},
	away: {
		sum: 0,
		win: 0,
		draw: 0,
		lose: 0
	}
};
const insideOver = {
	sum: 0,
	home: 0,
	draw: 0,
	away: 0
};

export const ODDS_INFO = {
	sum: 0,
	favoriteWin: 0,
	unFavoriteWin: 0,
	draw: 0,
	smallOdd: { ...inside },
	midOdd: { ...inside },
	highOdd: { ...inside },
	overOdds: {
		bothOver200: { ...insideOver },
		bothOver225: { ...insideOver },
		bothOver250: { ...insideOver },
		bothOver270: { ...insideOver }
	}
};

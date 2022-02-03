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

export const ODDS_INFO = {
	sum: 0,
	favoriteWin: 0,
	unFavoriteWin: 0,
	smallOdd: { ...inside },
	midOdd: { ...inside },
	highOdd: { ...inside }
};

export const DRAW_INFO = {
	sum: 0,
	drawWhenHomeFavorite: 0,
	drawWhenAwayFavorite: 0,
	drawWhenNoOneFavorite: 0, // 2+ odds mindkettőre
	drawWithGoals: 0,
	drawWithoutGoals: 0
};

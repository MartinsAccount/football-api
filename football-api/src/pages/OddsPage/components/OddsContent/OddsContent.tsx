import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import CustomStat from '../CustomStat/CustomStat';
import styles from './OddsContent.module.scss';

interface IArbitrageContentProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class OddsContent extends Component<IArbitrageContentProps> {
	render() {
		const { MainStore } = this.props;
		const { OddsStore } = this.props.MainStore;

		return (
			<section className={styles.contentContainer}>
				{OddsStore.currentFixtures && OddsStore.currentOdds && (
					<div className={styles.statistics}>
						<h1 className={styles.header}>{OddsStore.currentLeague}</h1>

						<article className={styles.statContainer}>
							<CustomStat
								title="Esélyesebb nyert"
								data={OddsStore.oddsInfos.favoriteWin}
								onCustomData={OddsStore.oddsInfos.sum}
							/>
							<CustomStat
								title="Esélytelenebb nyert"
								data={OddsStore.oddsInfos.unFavoriteWin}
								onCustomData={OddsStore.oddsInfos.sum}
							/>
						</article>
						<article className={styles.statContainer}>
							<CustomStat
								title="Hazai 1,5 alatt"
								data={OddsStore.homeSmallOdds}
								onCustomData={OddsStore.oddsInfos.smallOdd.home.sum}
							/>
							<CustomStat
								title="Vendég 1,5 alatt"
								data={OddsStore.awaySmallOdds}
								onCustomData={OddsStore.oddsInfos.smallOdd.away.sum}
							/>
						</article>
						<article className={styles.statContainer}>
							<CustomStat
								title="Hazai 1,5 - 1,9 között"
								data={OddsStore.homeMidOdds}
								onCustomData={OddsStore.oddsInfos.midOdd.home.sum}
							/>
							<CustomStat
								title="Vendég 1,5 - 1,9 között"
								data={OddsStore.awayMidOdds}
								onCustomData={OddsStore.oddsInfos.midOdd.away.sum}
							/>
						</article>
						<article className={styles.statContainer}>
							<CustomStat
								title="Hazai 1,9 felett"
								data={OddsStore.homeHighOdds}
								onCustomData={OddsStore.oddsInfos.highOdd.home.sum}
							/>
							<CustomStat
								title="Vendég 1,9 felett"
								data={OddsStore.awayHighOdds}
								onCustomData={OddsStore.oddsInfos.highOdd.away.sum}
							/>
						</article>
						<article className={styles.statContainer}>
							<CustomStat
								title="Döntetlen (hazai az esélyesebb)"
								data={OddsStore.drawInfos.drawWhenHomeFavorite}
								onCustomData={OddsStore.drawInfos.sum}
							/>
							<CustomStat
								title="Döntetlen (vendég az esélyesebb)"
								data={OddsStore.drawInfos.drawWhenAwayFavorite}
								onCustomData={OddsStore.drawInfos.sum}
							/>
						</article>
						<article className={styles.statContainer}>
							<CustomStat
								title="Döntetlen (mindkettő 2-es odds felett)"
								data={OddsStore.drawInfos.drawWhenNoOneFavorite}
								onCustomData={OddsStore.drawInfos.sum}
							/>
							{/* <CustomStat
								title="Döntetlen (vendég az esélyesebb)"
								data={OddsStore.drawInfos.drawWhenAwayFavorite}
								onCustomData={OddsStore.drawInfos.sum}
							/> */}
						</article>
					</div>
				)}
			</section>
		);
	}
}

export default OddsContent;

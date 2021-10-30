import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import CustomStat from '../CustomStat/CustomStat';
import styles from './FixtureContent.module.scss';

interface IArbitrageContentProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class FixtureContent extends Component<IArbitrageContentProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore, FixtureStore } = this.props.MainStore;

		return (
			<section className={styles.contentContainer}>
				{FixtureStore.fixtures && FixtureStore.results && (
					<div className={styles.statistics}>
						<h1 className={styles.header}>{FixtureStore.currentLeague}</h1>

						<article className={styles.statContainer}>
							<CustomStat title="Összes gól" data={FixtureStore.getAllGoals} />
							<CustomStat title="Meccsek száma" data={FixtureStore.getAllFixtures} onCustomData={FixtureStore.getAllGoals} />
						</article>
						<article className={styles.statContainer}>
							<CustomStat title="Mindkét csapat gól" data={FixtureStore.bothTeamsScore} />
							<CustomStat
								title="Első félidő összes gól"
								data={FixtureStore.getFirstHalfGoals}
								onCustomData={FixtureStore.getAllGoals}
							/>
						</article>
						<article className={styles.statContainer}>
							<CustomStat title="Döntetlen meccsek" data={FixtureStore.getDrawFixtures} />
							<CustomStat title="Hazai nyert meccsek" data={FixtureStore.getHomeWinners} />
						</article>
						<article className={styles.statContainer}>
							<CustomStat title="Páratlan gól" data={FixtureStore.getOddGoals} />
							<CustomStat title="Páros gól" data={FixtureStore.getEvenGoals} />
						</article>
						<article className={styles.statContainer}>
							<CustomStat title="0,5 gól felett" data={FixtureStore.overNullGoal} />
							<CustomStat title="1,5 gól felett" data={FixtureStore.overOneGoal} />
						</article>
						<article className={styles.statContainer}>
							<CustomStat
								title="Csapatok száma minimum 1 döntetlen"
								data={FixtureStore.teamWithDraw}
								onCustomData={FixtureStore.teamsNumber}
							/>
							{/* <CustomStat
								title="Csapatok száma minimum 1 döntetlen"
								data={FixtureStore.teamWithDraw}
								onCustomData={FixtureStore.teamsNumber}
							/> */}
						</article>
					</div>
				)}
			</section>
		);
	}
}

export default FixtureContent;

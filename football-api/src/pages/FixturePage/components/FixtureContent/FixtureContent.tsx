import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
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
						<div>Meccsek száma: {FixtureStore.getAllFixtures}</div>
						<div>Összes gól: {FixtureStore.getAllGoals}</div>
						<div>
							Mindkét csapat gól: {FixtureStore.bothTeamsScore} (
							{Math.round((FixtureStore.bothTeamsScore / FixtureStore.getAllFixtures) * 100)}%)
						</div>
						<div>
							Első félidő összes gól: {FixtureStore.getFirstHalfGoals} (
							{Math.round((FixtureStore.getFirstHalfGoals / FixtureStore.getAllGoals) * 100)}%)
						</div>
						<div>
							Döntetlen meccsek: {FixtureStore.getDrawFixtures} (
							{Math.round((FixtureStore.getDrawFixtures / FixtureStore.getAllFixtures) * 100)}
							%)
						</div>
						<div>
							Hazai nyert meccsek: {FixtureStore.getHomeWinners} (
							{Math.round((FixtureStore.getHomeWinners / FixtureStore.getAllFixtures) * 100)}
							%)
						</div>
						<div>
							Páratlan gól: {FixtureStore.getOddGoals} (
							{Math.round((FixtureStore.getOddGoals / FixtureStore.getAllFixtures) * 100)}%)
						</div>
						<div>
							Páros gól: {FixtureStore.getEvenGoals} (
							{Math.round((FixtureStore.getEvenGoals / FixtureStore.getAllFixtures) * 100)}%)
						</div>
					</div>
				)}
			</section>
		);
	}
}

export default FixtureContent;

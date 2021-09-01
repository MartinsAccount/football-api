import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { LEAGUES } from '../../models/constants';
import { MainStore } from '../../stores/MainStore';
import styles from './Leagues.module.scss';

interface ILeaguesProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class Leagues extends Component<ILeaguesProps> {
	render() {
		const { MainStore } = this.props;

		console.log('store', MainStore);

		return (
			<main>
				<div onClick={() => MainStore.testFetch()} className="button">
					Fetch datas
				</div>
				<div className={styles.container}>
					<button onClick={() => MainStore.leaguesStatistics('england')} className={styles.countryButton}>
						England
					</button>
					<button onClick={() => MainStore.leaguesStatistics('germany')} className={styles.countryButton}>
						Germany
					</button>
					<button onClick={() => MainStore.leaguesStatistics('spain')} className={styles.countryButton}>
						Spain
					</button>
					<button onClick={() => MainStore.leaguesStatistics('france')} className={styles.countryButton}>
						France
					</button>
					<button onClick={() => MainStore.leaguesStatistics('italy')} className={styles.countryButton}>
						Italy
					</button>
				</div>
				{MainStore.fixtures && MainStore.results && (
					<div className={styles.statistics}>
						<div>Meccsek száma: {MainStore.getAllFixtures}</div>
						<div>Összes gól: {MainStore.getAllGoals}</div>
						<div>
							Mindkét csapat gól: {MainStore.bothTeamsScore} (
							{Math.round((MainStore.bothTeamsScore / MainStore.getAllFixtures) * 100)}%)
						</div>
						<div>
							Első félidő összes gól: {MainStore.getFirstHalfGoals} (
							{Math.round((MainStore.getFirstHalfGoals / MainStore.getAllGoals) * 100)}%)
						</div>
						<div>
							Döntetlen meccsek: {MainStore.getDrawFixtures} (
							{Math.round((MainStore.getDrawFixtures / MainStore.getAllFixtures) * 100)}
							%)
						</div>
						<div>
							Hazai nyert meccsek: {MainStore.getHomeWinners} (
							{Math.round((MainStore.getHomeWinners / MainStore.getAllFixtures) * 100)}
							%)
						</div>
						<div>
							Páratlan gól: {MainStore.getOddGoals} ({Math.round((MainStore.getOddGoals / MainStore.getAllFixtures) * 100)}%)
						</div>
						<div>
							Páros gól: {MainStore.getEvenGoals} ({Math.round((MainStore.getEvenGoals / MainStore.getAllFixtures) * 100)}%)
						</div>
					</div>
				)}
			</main>
		);
	}
}

export default Leagues;

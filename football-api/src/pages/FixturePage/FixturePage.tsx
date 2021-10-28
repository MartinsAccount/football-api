import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import FixtureService from './services/FixtureService';
import { MainStore } from '../../stores/MainStore';
import styles from './FixturePage.module.scss';

interface IFixturePageProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class FixturePage extends Component<IFixturePageProps> {
	render() {
		const { MainStore } = this.props;
		const { FixtureStore } = this.props.MainStore;

		return (
			<main>
				<div className={styles.container}>
					<button onClick={() => FixtureStore.leaguesStatistics('england')} className={styles.countryButton}>
						Angol statisztikák
					</button>
					<button onClick={() => FixtureStore.leaguesStatistics('germany')} className={styles.countryButton}>
						Német statisztikák
					</button>
					<button onClick={() => FixtureStore.leaguesStatistics('spain')} className={styles.countryButton}>
						Spanyol statisztikák
					</button>
					<button onClick={() => FixtureStore.leaguesStatistics('france')} className={styles.countryButton}>
						Francia statisztikák
					</button>
					<button onClick={() => FixtureStore.leaguesStatistics('italy')} className={styles.countryButton}>
						Olasz statisztikák
					</button>
					<button onClick={() => FixtureService.GetTodayFixtures()} className={styles.countryButton}>
						Mai Meccsek lekérése
					</button>
					<button onClick={() => FixtureService.GetLeagues()} className={styles.countryButton}>
						Elérhető ligák lekérése
					</button>
				</div>

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
			</main>
		);
	}
}

export default FixturePage;

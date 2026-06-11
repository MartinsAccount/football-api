import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../stores/MainStore';
import OddsContent from './components/OddsContent/OddsContent';
import OddsSidebar from './components/OddsSidebar/OddsSidebar';
import styles from './OddsPage.module.scss';

interface IOddsPageProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class OddsPage extends Component<IOddsPageProps> {
	render() {
		const { MainStore } = this.props;
		const { OddsStore } = this.props.MainStore;

		const leagues = ['england', 'spain', 'germany', 'france', 'italy'];
		const stats = [
			'getAllGoals',
			'overNullGoal',
			'overOneGoal',
			'overTwoGoal',
			'bothTeamsScore',
			'getFirstHalfGoals',
			'getSecondHalfGoals',
			'getDrawFixtures',
			'getHomeWinners',
			'getOddGoals'
		];

		return (
			<main className={styles.pageContainer}>
				<OddsSidebar />
				<OddsContent />
			</main>
		);
	}
}

export default OddsPage;

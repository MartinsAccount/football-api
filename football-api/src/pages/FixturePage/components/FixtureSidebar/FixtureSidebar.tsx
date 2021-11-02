import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MyButton from '../../../../components/MyButton/MyButton';
import { LEAGUES } from '../../../../core/constants/constants';
import { MainStore } from '../../../../stores/MainStore';
import styles from './FixtureSidebar.module.scss';

interface IArbitrageButtonsProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class FixtureSidebar extends Component<IArbitrageButtonsProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore, FixtureStore } = this.props.MainStore;
		const g = 'getAllGoals';

		return (
			<aside className={styles.buttonsContainer}>
				<MyButton title="Angol statisztikák" onClick={() => FixtureStore.leaguesStatistics('england')} />
				<MyButton title="Teszt log" onClick={() => console.log(FixtureStore[g])} />
				<MyButton title="Német statisztikák" onClick={() => FixtureStore.leaguesStatistics('germany')} />
				<MyButton title="Spanyol statisztikák" onClick={() => FixtureStore.leaguesStatistics('spain')} />
				<MyButton title="Francia statisztikák" onClick={() => FixtureStore.leaguesStatistics('france')} />
				<MyButton title="Olasz statisztikák" onClick={() => FixtureStore.leaguesStatistics('italy')} />

				<div className={styles.marginTop}>
					{/* <MyButton title="Arbitrage elemzés" onClick={() => ArbitrageStore.getHighestOdds()} type="primary" /> */}
					<MyButton title="Összes statisztika" onClick={() => FixtureStore.leaguesStatistics('all')} type="primary" />
				</div>
			</aside>
		);
	}
}

export default FixtureSidebar;

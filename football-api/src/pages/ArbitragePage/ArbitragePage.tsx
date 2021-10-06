import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { LEAGUES } from '../../core/constants/constants';
import { MainStore } from '../../stores/MainStore';
import styles from './ArbitragePage.module.scss';

interface IArbitragePageProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class ArbitragePage extends Component<IArbitragePageProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		return (
			<>
				<div className={styles.container}>
					<button onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.ENGLAND)} className={styles.countryButton}>
						Angol arbitrage elemzés
					</button>
					<button onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.GERMANY)} className={styles.countryButton}>
						Német arbitrage elemzés
					</button>
					<button onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.SPAIN)} className={styles.countryButton}>
						Spanyol arbitrage elemzés
					</button>
					<button onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.FRANCE)} className={styles.countryButton}>
						Francia arbitrage elemzés
					</button>
					<button onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.ITALY)} className={styles.countryButton}>
						Olasz arbitrage elemzés
					</button>
				</div>
				<div className={styles.container}>
					<button onClick={() => ArbitrageStore.getAvailableFixtures()} className={styles.countryButton}>
						Mecccsek amelyekre elérhetőek már az odds-ok
					</button>
					<button onClick={() => ArbitrageStore.getHighestOdds()} className={styles.countryButton}>
						Arbitrage kalkulálás
					</button>
				</div>
			</>
		);
	}
}

export default ArbitragePage;

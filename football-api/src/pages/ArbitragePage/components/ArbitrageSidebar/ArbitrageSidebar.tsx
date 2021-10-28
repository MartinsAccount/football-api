import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MyButton from '../../../../components/MyButton/MyButton';
import { LEAGUES } from '../../../../core/constants/constants';
import { MainStore } from '../../../../stores/MainStore';
import styles from './ArbitrageSidebar.module.scss';

interface IArbitrageButtonsProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class ArbitrageSidebar extends Component<IArbitrageButtonsProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		return (
			<aside className={styles.buttonsContainer}>
				<MyButton title="Angol bajnokság" onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.ENGLAND)} />
				<MyButton title="Német bajnokság" onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.GERMANY)} />
				<MyButton title="Spanyol bajnokság" onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.SPAIN)} />
				<MyButton title="Francia bajnokság" onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.FRANCE)} />
				<MyButton title="Olasz bajnokság" onClick={() => ArbitrageStore.getHighestOdds(LEAGUES.ITALY)} />

				<div className={styles.marginTop}>
					{/* <MyButton title="Arbitrage elemzés" onClick={() => ArbitrageStore.getHighestOdds()} type="primary" /> */}
					<MyButton title="Arbitrage elemzés" onClick={() => ArbitrageStore.getHighestOdds()} type="primary" />
				</div>
			</aside>
		);
	}
}

export default ArbitrageSidebar;

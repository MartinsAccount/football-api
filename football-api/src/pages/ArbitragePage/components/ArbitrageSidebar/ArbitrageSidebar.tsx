import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MyButton from '../../../../components/MyButton/MyButton';
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
			<aside className={styles.sidebar}>
				<section className={styles.buttonsContainer}>
					<MyButton title="Arbitrage elemzés" onClick={() => ArbitrageStore.selectAllLeaguesId()} type="primary" />
					{/* <MyButton title="Teszt lekérések" onClick={() => ArbitrageStore.testFetch()} type="primary" /> */}
					<MyButton
						active={ArbitrageStore.filtering === 'goodArbitrage'}
						title="1 alatti arbitrage"
						onClick={() => ArbitrageStore.setFilter('goodArbitrage')}
					/>
					<MyButton active={!ArbitrageStore.filtering} title="Összes kártya" onClick={() => ArbitrageStore.setFilter(null)} />
				</section>
			</aside>
		);
	}
}

export default ArbitrageSidebar;

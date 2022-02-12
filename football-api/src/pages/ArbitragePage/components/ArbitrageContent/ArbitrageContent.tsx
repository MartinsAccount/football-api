import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IArbitrage } from '../../models/models';
import FootballCard from '../FootballCard/FootballCard';
import Modal from '../Modal/Modal';
import RowItem from '../RowItem/RowItem';
import styles from './ArbitrageContent.module.scss';

interface IArbitrageContentProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class ArbitrageContent extends Component<IArbitrageContentProps> {
	render() {
		// const { MainStore } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		return (
			<section className={styles.contentContainer}>
				<div className={styles.filterButtons}>
					<div onClick={() => ArbitrageStore.setFilter('goodArbitrage')}>1 alatti arbitrage</div>
					<div onClick={() => ArbitrageStore.setFilter('')}>Összes kártya</div>
				</div>
				{/* 	{ArbitrageStore.getArbitrages.map((data: IArbitrage, index: number) => (
					<FootballCard key={data.fixture} data={data} />
				))}
 */}
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						{ArbitrageStore.getArbitrages.map((data: IArbitrage, index: number) => (
							<RowItem key={data.fixture} data={data} index={index} />
						))}
					</table>
				</div>

				{ArbitrageStore.selectedItem && <Modal />}
			</section>
		);
	}
}

export default ArbitrageContent;

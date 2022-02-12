import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IArbitrage } from '../../models/models';
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
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						{ArbitrageStore.getArbitrages.map((data: IArbitrage, index: number) => (
							<RowItem key={index} data={data} index={index} />
						))}
					</table>
				</div>

				{ArbitrageStore.selectedItem && <Modal />}
			</section>
		);
	}
}

export default ArbitrageContent;

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IHighestOdds } from '../../models/models';
import styles from './Modal.module.scss';

interface IModalProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class Modal extends Component<IModalProps> {
	render() {
		const { ArbitrageStore } = this.props.MainStore;

		return (
			<article className={styles.modalContainer}>
				<div className={styles.wrapper}>
					<div className={styles.closeButton} onClick={() => ArbitrageStore.setSelectedItem()}>
						X
					</div>
					<table>
						<tr>
							<th className={styles.cell}>Bookmaker</th>
							<th className={styles.cell}>Name</th>
							<th className={styles.cell}>Odd</th>
						</tr>
						{ArbitrageStore.selectedItem.highestOdds.map((item: IHighestOdds, index: number) => (
							<tr key={index}>
								<td className={styles.cell}>{item?.bookmaker}</td>
								<td className={styles.cell}>{item?.name}</td>
								<td className={styles.cell}>{item?.odd}</td>
							</tr>
						))}
					</table>
				</div>
			</article>
		);
	}
}

export default Modal;

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import styles from './OddsContent.module.scss';
import { v4 as uuidv4 } from 'uuid';
import { ITableRow } from '../../stores/OddsStore';
import RowItem from '../RowItem/RowItem';

interface IArbitrageContentProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class OddsContent extends Component<IArbitrageContentProps> {
	render() {
		// const { MainStore } = this.props;
		const { OddsStore } = this.props.MainStore;

		return (
			<section className={styles.contentContainer}>
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						<thead>
							<tr className={styles.headerRow}>
								<th className={styles.cell}></th>
								<th className={styles.cell}>Győzelem</th>
								<th className={styles.cell}>Döntetlen</th>
								<th className={styles.cell}>Vereség</th>
								<th className={styles.cell}>Szám</th>
								<th className={styles.cell}>/Öszes</th>
								<th className={styles.cell}>Százalék (%)</th>
							</tr>
						</thead>
						<tbody>
							{OddsStore.getTableRows.map((data: ITableRow, index: number) => (
								<RowItem key={uuidv4()} data={data} index={index} />
							))}
						</tbody>
					</table>
				</div>
			</section>
		);
	}
}

export default OddsContent;

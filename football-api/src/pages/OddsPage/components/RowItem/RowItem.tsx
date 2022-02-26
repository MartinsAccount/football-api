import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { ITableRow } from '../../models/ITableRow';
import styles from './RowItem.module.scss';
// import { v4 as uuidv4 } from 'uuid';

interface IRowItemProps {
	MainStore?: MainStore;
	data: ITableRow;
	index: number;
}

@inject('MainStore')
@observer
class RowItem extends Component<IRowItemProps> {
	render() {
		const { data } = this.props;
		// const { ArbitrageStore } = this.props.MainStore;

		return (
			<tr className={styles.row}>
				<td className={styles.cell}>{data.title}</td>
				<td className={styles.cell}>{data?.GY}</td>
				<td className={styles.cell}>{data?.D}</td>
				<td className={styles.cell}>{data?.V}</td>
				<td className={styles.cell}>{data?.data}</td>
				<td className={styles.cell}>{data.onCustomData}</td>
				<td className={styles.cell}>{data.onCustomData}</td>
			</tr>
		);
	}
}

export default RowItem;

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IAnalyzedFixture, IArbitrage, IHighestOdds } from '../../models/models';
import styles from './RowItem.module.scss';
import { v4 as uuidv4 } from 'uuid';

interface IRowItemProps {
	MainStore?: MainStore;
	data: IAnalyzedFixture;
	index: number;
}

@inject('MainStore')
@observer
class RowItem extends Component<IRowItemProps> {
	bookmakerString = (item: IArbitrage): string => {
		// const obj: IArbitrage = Object.values(item)[0];
		const highestOdds = item.highestOdds || [];

		let bookmakers = [];
		let odds = [];

		highestOdds?.forEach((it: IHighestOdds) => {
			let bet = `${it.odd} - (${it.name})`;

			bookmakers.push(it.bookmaker);
			odds.push(bet);
		});

		const joined = `${bookmakers.join('/')} - ${odds.join('/')}`;
		return joined;
	};

	render() {
		const { data, index } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		const inputDate = new Date(data?.date);
		const options: Intl.DateTimeFormatOptions = {
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		};

		const formattedDate = inputDate.toLocaleString('en-US', options);

		if (index === 0) {
			return (
				<thead>
					<tr className={styles.headerRow}>
						<th className={styles.cell}>Fixture</th>
						<th className={styles.cell}>Country</th>
						<th className={styles.cell}>League</th>
						<th className={styles.cell}>Date</th>

						{data.arbitrages.map((item: IArbitrage) => (
							<th key={uuidv4()} className={styles.cell}>
								{item.name}
							</th>
						))}
					</tr>
				</thead>
			);
		}

		return (
			<tr className={styles.row}>
				<td className={styles.cell}>{data?.fixture}</td>
				<td className={styles.cell}>{data?.country}</td>
				<td className={styles.cell}>{data?.leagueName}</td>
				<td className={styles.cell}>{formattedDate}</td>

				{data.arbitrages.map((item: IArbitrage) => (
					<td
						key={uuidv4()}
						onClick={() => ArbitrageStore.setSelectedItem(item)}
						className={`${styles.clickableCell} ${item.arbitrage < 1 && item.arbitrage !== null && styles.arbitrageNumber}`}
					>
						{!item.arbitrage ? '-' : item.arbitrage}
					</td>
				))}
			</tr>
		);
	}
}

export default RowItem;

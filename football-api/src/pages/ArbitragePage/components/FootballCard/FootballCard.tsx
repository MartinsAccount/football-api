import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IAnalyzedResult, IArbitrage, IHighestOdds } from '../../models/models';
import styles from './FootballCard.module.scss';

interface IFootballCardProps {
	MainStore?: MainStore;
	data: IArbitrage;
}

@inject('MainStore')
@observer
class FootballCard extends Component<IFootballCardProps> {
	bookmakerString = (item: IAnalyzedResult): string => {
		// const obj: IAnalyzedResult = Object.values(item)[0];
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
		const { data } = this.props;
		// const { ArbitrageStore } = this.props.MainStore;

		return (
			<article className={styles.cardContainer}>
				<div>{data.country}</div>
				<div>{data.leagueName}</div>
				<div>{data.date}</div>
				<div className={styles.betTypes}>
					<div>
						<div>Match winner</div>
						<div className={styles.arbitrageNumber}>{data?.analyzed[0]?.arbitrage}</div>
					</div>
					<div>
						<div>Home / Away</div>
						<div className={styles.arbitrageNumber}>{data?.analyzed[1]?.arbitrage}</div>
					</div>
				</div>

				<article className={styles.cardModal}>
					{data.analyzed.map((it: IAnalyzedResult) => (
						<div className={styles.modalItem}>
							<div>{it?.name}</div>
							<div>{this.bookmakerString(it)}</div>
							<div className={styles.arbitrageNumber}>{it?.arbitrage}</div>
						</div>
					))}
				</article>
			</article>
		);
	}
}

export default FootballCard;

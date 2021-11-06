import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IAnalyzedElement, IAnalyzedResult, IArbitrage, IHighestOdds } from '../../models/models';
import styles from './FootballCard.module.scss';

interface IFootballCardProps {
	MainStore?: MainStore;
	data: IArbitrage;
}

@inject('MainStore')
@observer
class FootballCard extends Component<IFootballCardProps> {
	bookmakeString = (item: IAnalyzedElement) => {
		const obj: IAnalyzedResult = Object.values(item)[0];
		const highestOdds = obj.highestOdds || [];

		let bookmakers = [];
		let odds = [];

		highestOdds?.forEach((it) => {
			bookmakers.push(it.bookmaker);
		});
		highestOdds?.forEach((it) => {
			let string = `${it.odd} (${it.name})`;
			odds.push(string);
		});

		const joined = `${bookmakers.join('/')} - ${odds.join('/')}`;
		return joined;
	};

	render() {
		const { data } = this.props;
		// const { ArbitrageStore } = this.props.MainStore;

		return (
			<article className={styles.cardContainer}>
				<div>{data.fixture}</div>
				<div>{data.date}</div>
				<div>{data.country}</div>
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
					{data.analyzed.map((it) => (
						<div className={styles.modalItem}>
							<div>{it?.name}</div>
							<div>{this.bookmakeString(it)}</div>
							<div>{it?.arbitrage}</div>
						</div>
					))}
				</article>
			</article>
		);
	}
}

export default FootballCard;

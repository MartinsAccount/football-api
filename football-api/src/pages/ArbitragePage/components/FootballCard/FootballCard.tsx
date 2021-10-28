import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IArbitrage } from '../../models/models';
import styles from './FootballCard.module.scss';

interface IFootballCardProps {
	MainStore?: MainStore;
	data: IArbitrage;
}

@inject('MainStore')
@observer
class FootballCard extends Component<IFootballCardProps> {
	render() {
		const { data } = this.props;
		// const { ArbitrageStore } = this.props.MainStore;

		return (
			<article className={styles.cardContainer}>
				<div>{data.fixture}</div>
				<div>{data.date}</div>
				<div>{data.country}</div>
				<div className={styles.betTypes}>
					{data.matchWinner && (
						<div>
							<div>Match winner</div>
							<div className={styles.arbitrageNumber}>{data.matchWinner.arbitrage}</div>
						</div>
					)}
					{data.homeAway && (
						<div>
							<div>Home / Away</div>
							<div className={styles.arbitrageNumber}>{data.homeAway.arbitrage}</div>
						</div>
					)}
				</div>
				<article className={styles.cardModal}></article>
			</article>
		);
	}
}

export default FootballCard;

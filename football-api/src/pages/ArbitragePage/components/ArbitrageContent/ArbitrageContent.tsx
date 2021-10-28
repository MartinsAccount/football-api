import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IArbitrage } from '../../models/models';
import FootballCard from '../FootballCard/FootballCard';
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
				{ArbitrageStore.Arbitrages.map((data: IArbitrage) => (
					<FootballCard key={data.fixture} data={data} />
				))}
			</section>
		);
	}
}

export default ArbitrageContent;

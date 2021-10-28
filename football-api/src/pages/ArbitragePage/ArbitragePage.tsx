import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { LEAGUES } from '../../core/constants/constants';
import { MainStore } from '../../stores/MainStore';
import styles from './ArbitragePage.module.scss';
import ArbitrageSidebar from './components/ArbitrageSidebar/ArbitrageSidebar';
import ArbitrageContent from './components/ArbitrageContent/ArbitrageContent';

interface IArbitragePageProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class ArbitragePage extends Component<IArbitragePageProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		return (
			<main className={styles.pageContainer}>
				<ArbitrageSidebar />
				<ArbitrageContent />
			</main>
		);
	}
}

export default ArbitragePage;

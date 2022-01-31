import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../stores/MainStore';
import styles from './LoadingScreen.module.scss';

interface ILoadingScreenProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class LoadingScreen extends Component<ILoadingScreenProps> {
	render() {
		const { MainStore } = this.props;
		const { OddsStore, ArbitrageStore } = this.props.MainStore;

		return (
			<>
				<div className={styles.loadingBackground}></div>
				<div className={styles.loadingPopup}>
					<div className={styles.ldsRing}>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<h2>Loading...</h2>
				</div>
			</>
		);
	}
}

export default LoadingScreen;

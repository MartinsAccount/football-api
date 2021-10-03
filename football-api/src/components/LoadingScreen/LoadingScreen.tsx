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

		if (MainStore.isLoading) {
			return (
				<div className={styles.loadingPopup}>
					<h2>Loading...</h2>
				</div>
			);
		}

		return <div></div>;
	}
}

export default LoadingScreen;

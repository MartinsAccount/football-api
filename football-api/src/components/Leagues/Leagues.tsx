import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { LEAGUES } from '../../core/constants/constants';
import { MainStore } from '../../stores/MainStore';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import styles from './Leagues.module.scss';

interface ILeaguesProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class Leagues extends Component<ILeaguesProps> {
	render() {
		const { MainStore } = this.props;
		const { OddsStore, ArbitrageStore, FixtureStore } = this.props.MainStore;

		console.log('store', MainStore);

		return (
			<main>
				<LoadingScreen />
				<div onClick={() => MainStore.testFetch()} className="button">
					Test Fetch MainStore
				</div>
				<div onClick={() => MainStore.baseballFetch()} className="button">
					BASEBALL Fetch datas
				</div>
				<div onClick={() => MainStore.basketballFetch()} className="button">
					KOSÁRLABDA Fetch datas
				</div>
				<div onClick={() => OddsStore.testFunc()} className="button">
					Test actions with odds
				</div>
			</main>
		);
	}
}

export default Leagues;

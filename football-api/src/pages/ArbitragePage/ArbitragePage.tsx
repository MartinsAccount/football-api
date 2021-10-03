import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../stores/MainStore';
import styles from './ArbitragePage.module.scss';

interface IArbitragePageProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class ArbitragePage extends Component<IArbitragePageProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		return <div></div>;
	}
}

export default ArbitragePage;

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import styles from './OddsContent.module.scss';

interface IArbitrageContentProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class OddsContent extends Component<IArbitrageContentProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		return <section className={styles.contentContainer}></section>;
	}
}

export default OddsContent;

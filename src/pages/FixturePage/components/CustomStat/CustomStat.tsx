import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import styles from './CustomStat.module.scss';

interface IArbitrageContentProps {
	MainStore?: MainStore;
	onAllFixtures: boolean;
	onCustomData?: number;
	title: string;
	data: number;
}

@inject('MainStore')
@observer
class FixtureContent extends Component<IArbitrageContentProps> {
	static defaultProps: {
		onAllFixtures: true;
	};

	render() {
		const { MainStore, title, data, onCustomData } = this.props;
		const { FixtureStore } = MainStore;

		if (onCustomData) {
			return (
				<article className={styles.statItem}>
					{title}: {data} ({Math.round((data / onCustomData) * 100)}%)
				</article>
			);
		}

		return (
			<article className={styles.statItem}>
				{title}: {data} ({Math.round((data / FixtureStore.getAllFixtures) * 100)}%)
			</article>
		);
	}
}

export default FixtureContent;

import { inject, observer } from 'mobx-react';
import { type } from 'os';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import styles from './CustomStat.module.scss';

interface IArbitrageContentProps {
	MainStore?: MainStore;
	onAllFixtures: boolean;
	onCustomData?: number;
	title: string;
	data: number | string;
}

@inject('MainStore')
@observer
class FixtureContent extends Component<IArbitrageContentProps> {
	static defaultProps: {
		onAllFixtures: true;
	};

	render() {
		const { MainStore, title, data, onCustomData } = this.props;
		const { OddsStore } = MainStore;

		if (onCustomData) {
			return (
				<article className={styles.statItem}>
					<span>
						{title}: <strong>{data} db</strong>
					</span>
					{typeof data === 'number' && (
						<span>
							/ {onCustomData} db ({Math.round((data / onCustomData) * 100)}%)
						</span>
					)}
					{typeof data === 'string' && <span>/ {onCustomData} db</span>}
				</article>
			);
		}

		return (
			<article className={styles.statItem}>
				{/* {title}: {data} ({Math.round((data / OddsStore.getAllFixtures) * 100)}%) */}
			</article>
		);
	}
}

export default FixtureContent;

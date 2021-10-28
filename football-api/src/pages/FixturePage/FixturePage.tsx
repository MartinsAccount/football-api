import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import FixtureService from './services/FixtureService';
import { MainStore } from '../../stores/MainStore';
import styles from './FixturePage.module.scss';
import FixtureSidebar from './components/FixtureSidebar/FixtureSidebar';
import FixtureContent from './components/FixtureContent/FixtureContent';

interface IFixturePageProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class FixturePage extends Component<IFixturePageProps> {
	render() {
		const { MainStore } = this.props;
		const { FixtureStore } = this.props.MainStore;

		return (
			<main className={styles.pageContainer}>
				<FixtureSidebar />
				<FixtureContent />
			</main>
		);
	}
}

export default FixturePage;

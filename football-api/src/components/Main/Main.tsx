import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../stores/MainStore';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import styles from './Main.module.scss';
import OddsPage from '../../pages/OddsPage/OddsPage';
import FixturePage from '../../pages/FixturePage/FixturePage';
import ArbitragePage from '../../pages/ArbitragePage/ArbitragePage';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

interface IMainProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class Main extends Component<IMainProps> {
	render() {
		const { MainStore } = this.props;
		const { OddsStore, ArbitrageStore } = this.props.MainStore;

		return (
			<Router>
				<div>
					{MainStore.isLoading && <LoadingScreen />}

					<nav className={styles.navbar}>
						<ul>
							<li>
								<NavLink activeStyle={{ backgroundColor: '#801414' }} to="/odds">
									Odds műveletek
								</NavLink>
							</li>
							<li>
								<NavLink activeStyle={{ backgroundColor: '#801414' }} to="/fixtures">
									Meccs statisztikák
								</NavLink>
							</li>
							<li>
								<NavLink activeStyle={{ backgroundColor: '#801414' }} to="/arbitrage">
									Arbitrage
								</NavLink>
							</li>
							<li style={{ marginLeft: 'auto', marginRight: '20px', color: '#fff' }}>Kérések száma: {MainStore.fetchNumber}</li>
						</ul>
					</nav>

					<Switch>
						<Route path="/odds">
							<OddsPage />
						</Route>
						<Route path="/fixtures">
							<FixturePage />
						</Route>
						<Route path="/arbitrage">
							<ArbitragePage />
						</Route>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default Main;

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../stores/MainStore';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import styles from './Main.module.scss';
import OddsPage from '../../pages/OddsPage/OddsPage';
import FixturePage from '../../pages/FixturePage/FixturePage';
import ArbitragePage from '../../pages/ArbitragePage/ArbitragePage';

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
					<nav className={styles.navbar}>
						<ul>
							<li>
								<Link to="/odds">Odds műveletek</Link>
							</li>
							<li>
								<Link to="/fixtures">Meccs statisztikák</Link>
							</li>
							<li>
								<Link to="/arbitrage">Arbitrage</Link>
							</li>
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

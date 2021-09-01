import './App.css';
import React, { Component } from 'react';
import { MainStore } from './stores/MainStore';
import { Provider } from 'mobx-react';
import Leagues from './components/Leagues/Leagues';

class App extends Component {
	private stores = { MainStore: new MainStore() };

	render() {
		return (
			<Provider {...this.stores}>
				<Leagues />
			</Provider>
		);
	}
}

export default App;

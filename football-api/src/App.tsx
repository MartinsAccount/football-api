import './App.css';
import React, { Component } from 'react';
import { MainStore } from './stores/MainStore';
import { Provider } from 'mobx-react';
import Main from './components/Main/Main';

class App extends Component {
	private stores = { MainStore: new MainStore() };

	render() {
		return (
			<Provider {...this.stores}>
				<Main />
			</Provider>
		);
	}
}

export default App;

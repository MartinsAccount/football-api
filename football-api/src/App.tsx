import './App.css';
import React, { Component } from 'react';
import { MainStore } from './stores/MainStore';
import { Provider } from 'mobx-react';

interface IAppProps {
	MainStore?: MainStore;
}

class App extends Component<IAppProps> {
	private stores = { MainStore: new MainStore() };

	render() {
		const { MainStore } = this.props;

		return (
			<Provider {...this.stores}>
				<div onClick={() => this.stores.MainStore.testFetch()} className="button">
					Fetch datas
				</div>
			</Provider>
		);
	}
}

export default App;

import './App.css';
import React, { Component } from 'react';
import { MainStore } from './stores/MainStore';
import { Provider } from 'mobx-react';

interface IAppProps {
	MainStore?: MainStore;
}

class App extends Component<IAppProps> {
	private stores = { MainStore: new MainStore() };

	fetchData = async () => {
		let myHeaders = new Headers();
		myHeaders.append('x-rapidapi-key', '91b0609029c3b070f6c0de0c6e7c8950');
		myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		const response = await fetch('https://v3.football.api-sports.io/leagues', requestOptions);
		const jsonResp = await response.json();
		// console.log(jsonResp);
	};
	fetchOdds = async () => {
		let myHeaders = new Headers();
		myHeaders.append('x-rapidapi-key', '91b0609029c3b070f6c0de0c6e7c8950');
		myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		const response = await fetch('https://v3.football.api-sports.io/odds?season=2021&league=39&bookmaker=16', requestOptions);
		const jsonResp = await response.json();
		console.log(jsonResp);
		console.log(JSON.stringify(jsonResp));
	};
	fetchFixtures = async () => {
		let myHeaders = new Headers();
		myHeaders.append('x-rapidapi-key', '91b0609029c3b070f6c0de0c6e7c8950');
		myHeaders.append('x-rapidapi-host', 'v3.football.api-sports.io');

		const requestOptions: RequestInit = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		const response = await fetch('https://v3.football.api-sports.io/fixtures?season=2020&league=140', requestOptions);
		const jsonResp = await response.json();
		console.log(jsonResp);
		console.log(JSON.stringify(jsonResp));
	};

	render() {
		return (
			<Provider {...this.stores}>
				<div onClick={() => this.fetchFixtures()} className="button">
					Fetch datas
				</div>
			</Provider>
		);
	}
}

export default App;

import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../stores/MainStore';
import styles from './OddsPage.module.scss';

interface IOddsPageProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class OddsPage extends Component<IOddsPageProps> {
	render() {
		const { MainStore } = this.props;
		const { OddsStore } = this.props.MainStore;

		return (
			<div className={styles.container}>
				<button onClick={() => OddsStore.saveOdds('england')} className={styles.countryButton}>
					Angol odds-ok mentése
				</button>
				<button onClick={() => OddsStore.saveOdds('germany')} className={styles.countryButton}>
					Német odds-ok mentése
				</button>
				<button onClick={() => OddsStore.saveOdds('spain')} className={styles.countryButton}>
					Spanyol odds-ok mentése
				</button>
				<button onClick={() => OddsStore.saveOdds('france')} className={styles.countryButton}>
					Francia odds-ok mentése
				</button>
				<button onClick={() => OddsStore.saveOdds('italy')} className={styles.countryButton}>
					Olasz odds-ok mentése
				</button>
			</div>
		);
	}
}

export default OddsPage;

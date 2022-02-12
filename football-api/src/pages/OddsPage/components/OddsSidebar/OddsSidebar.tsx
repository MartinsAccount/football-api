import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MyButton from '../../../../components/MyButton/MyButton';
import { LEAGUES } from '../../../../core/constants/constants';
import { MainStore } from '../../../../stores/MainStore';
import styles from './OddsSidebar.module.scss';

interface IArbitrageButtonsProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class OddsSidebar extends Component<IArbitrageButtonsProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore, OddsStore } = this.props.MainStore;

		return (
			<aside className={styles.sidebar}>
				<section className={styles.buttonsContainer}>
					<MyButton title="Angol odds-ok elemzése" onClick={() => OddsStore.changeCurrentOddsLeague('englandOdds')} />
					<MyButton title="Német odds-ok elemzése" onClick={() => OddsStore.changeCurrentOddsLeague('germanyOdds')} />
					<MyButton title="Spanyol odds-ok elemzése" onClick={() => OddsStore.changeCurrentOddsLeague('spainOdds')} />
					<MyButton title="Francia odds-ok elemzése" onClick={() => OddsStore.changeCurrentOddsLeague('franceOdds')} />
					<MyButton title="Olasz odds-ok elemzése" onClick={() => OddsStore.changeCurrentOddsLeague('italyOdds')} />

					<div className={styles.marginTop}>
						<MyButton title="Összes mentett odds lekérése" onClick={() => OddsStore.getSavedOdds()} type="primary" />
					</div>

					<MyButton title="Angol odds-ok mentése" onClick={() => OddsStore.saveOdds('england')} />
					<MyButton title="Német odds-ok mentése" onClick={() => OddsStore.saveOdds('germany')} />
					<MyButton title="Spanyol odds-ok mentése" onClick={() => OddsStore.saveOdds('spain')} />
					<MyButton title="Francia odds-ok mentése" onClick={() => OddsStore.saveOdds('france')} />
					<MyButton title="Olasz odds-ok mentésen" onClick={() => OddsStore.saveOdds('italy')} />

					<div className={styles.marginTop}>
						<MyButton title="Összes odds mentése" onClick={() => OddsStore.saveOdds('all')} type="primary" />
					</div>
				</section>
			</aside>
		);
	}
}

export default OddsSidebar;

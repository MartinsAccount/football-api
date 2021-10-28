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
			<aside className={styles.buttonsContainer}>
				<MyButton title="Angol odds-ok mentése" onClick={() => OddsStore.saveOdds('england')} />
				<MyButton title="Német odds-ok mentése" onClick={() => OddsStore.saveOdds('germany')} />
				<MyButton title="Spanyol odds-ok mentése" onClick={() => OddsStore.saveOdds('spain')} />
				<MyButton title="Francia odds-ok mentése" onClick={() => OddsStore.saveOdds('france')} />
				<MyButton title="Olasz odds-ok mentésen" onClick={() => OddsStore.saveOdds('italy')} />

				<div className={styles.marginTop}>
					{/* <MyButton title="Arbitrage elemzés" onClick={() => ArbitrageStore.getHighestOdds()} type="primary" /> */}
					<MyButton title="Összes odds mentése" onClick={() => console.log('összes mentése')} type="primary" />
				</div>
			</aside>
		);
	}
}

export default OddsSidebar;

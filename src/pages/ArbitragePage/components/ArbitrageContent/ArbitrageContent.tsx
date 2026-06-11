import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IAnalyzedFixture } from '../../models/models';
import Modal from '../Modal/Modal';
import RowItem from '../RowItem/RowItem';
import styles from './ArbitrageContent.module.scss';
import { v4 as uuidv4 } from 'uuid';
import MyButton from '../../../../components/MyButton/MyButton';
import { IArbitrageByBetType } from '../../models/IArbitrageByBetType';
import FixtureInformationModal from '../FixtureInformationModal/FixtureInformationModal';

interface IArbitrageContentProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class ArbitrageContent extends Component<IArbitrageContentProps> {
	componentDidMount(): void {
		this.props.MainStore.ArbitrageStore.Init();
	}

	render() {
		// const { MainStore } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		if (this.props.MainStore.isLoading) {
			return <section className={styles.contentContainer}>Loading...</section>;
		}

		if (ArbitrageStore.isBetTypeView) {
			return (
				<section
					style={{ display: 'flex', flex: 1, flexDirection: 'column', marginBottom: '8px', marginLeft: 350, marginTop: 80 }}
				>
					<div className={styles.listRowByBetTypeHeader} style={{ display: 'flex' }}>
						<div style={{ flex: 1 }}>
							{'Bet Type'.toUpperCase()} ({ArbitrageStore.getArbitragesByBetType.length})
						</div>
						<div style={{ flex: 1 }}>{'Arbitrage'.toUpperCase()}</div>
						{/* Egyéb adatokat is hozzáadhatod az alábbiakhoz */}

						<div style={{ display: 'flex', flex: 4 }}>
							{[...Array(3)].map((_, bookmakerIndex) => {
								return (
									<div key={bookmakerIndex} style={{ flex: 1, marginRight: '8px' }}>
										<strong>{'Bookmaker'.toUpperCase()}</strong> - {'Odd'.toUpperCase()} - {'Bet'.toUpperCase()}
									</div>
								);
							})}
						</div>
					</div>
					<div className={styles.separator}></div>
					{ArbitrageStore.getArbitragesByBetType.map((data: IArbitrageByBetType, index: number) => (
						<div
							onClick={() => ArbitrageStore.selectArbitrageByBetTypeItem(data)}
							className={styles.listRowByBetType}
							key={index}
							style={
								ArbitrageStore.isSelectedListItem(data) ? { display: 'flex', backgroundColor: '#ff9e00' } : { display: 'flex' }
							}
						>
							<div style={{ flex: 1 }}>{data.betType}</div>
							<div style={{ flex: 1 }}>{data.arbitrage}</div>
							{/* Egyéb adatokat is hozzáadhatod az alábbiakhoz */}

							<div style={{ display: 'flex', flex: 4 }}>
								{[...Array(3)].map((_, bookmakerIndex) => {
									const bookmaker = data.bookmakers[bookmakerIndex] || null;

									if (!bookmaker) {
										return <div key={bookmakerIndex} style={{ flex: 1, marginRight: '8px' }}></div>;
									}

									return (
										<div key={bookmakerIndex} style={{ flex: 1, marginRight: '8px' }}>
											<strong>{bookmaker.bookmaker}</strong> - {bookmaker.odd} - {bookmaker.name}
										</div>
									);
								})}
							</div>
						</div>
					))}

					{ArbitrageStore.isOpenFixtureInformationModal && <FixtureInformationModal />}
				</section>
			);
		}

		// {
		// 	ArbitrageStore.getArbitragesByBetType.map((data: IArbitrageByBetType, index: number) => (
		// 		<div style={{ display: 'flex' }}>
		// 			<div style={{ flex: 1 }}>{data.betType}</div>
		// 			<div style={{ flex: 1 }}>{data.arbitrage}</div>
		// 		</div>
		// 	));
		// }

		return (
			<section className={styles.contentContainer}>
				<div className={styles.contentHeader}>
					<div className={styles.contentHeaderButtons}>
						<MyButton
							active={ArbitrageStore.filtering === 'goodArbitrage'}
							title="Arbitrage < 1"
							onClick={() => ArbitrageStore.setFilter('goodArbitrage')}
						/>
						<MyButton
							active={!ArbitrageStore.filtering}
							title={`All (${ArbitrageStore.Arbitrages.length})`}
							onClick={() => ArbitrageStore.setFilter(null)}
						/>
					</div>

					{/* <div className={styles.contentHeaderButtons}>
						<MyButton title="Refresh Arbitrages" onClick={() => ArbitrageStore.searchAllLeagueIds()} type="primary" />
					</div> */}
				</div>
				<div className={styles.contentInformations}>
					<div>Fixtures: {ArbitrageStore.getInformations.fixtures}</div>
					<div>All Arbitrage: {ArbitrageStore.getInformations.allArbitrage}</div>
					<div>Good Arbitrage: {ArbitrageStore.getInformations.goodArbitrage}</div>
					<div>Good Arbitrage (two params): {ArbitrageStore.getInformations.goodWithTwoParams}</div>
					<div>Good Arbitrage (three params): {ArbitrageStore.getInformations.gooWithThreeParams}</div>
				</div>

				<div className={styles.tableContainer}>
					<table className={styles.table}>
						{ArbitrageStore.getArbitrages.map((data: IAnalyzedFixture, index: number) => (
							<RowItem key={uuidv4()} data={data} index={index} />
						))}
					</table>
				</div>

				{ArbitrageStore.selectedItem && <Modal />}
			</section>
		);
	}
}

export default ArbitrageContent;

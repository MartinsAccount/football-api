import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MyButton from '../../../../components/MyButton/MyButton';
import { MainStore } from '../../../../stores/MainStore';
import styles from './ArbitrageSidebar.module.scss';
import { ArrowRightSvg } from '../../../../assets/ArrowRightSvg';
import { ArrowDownSvg } from '../../../../assets/ArrowDownSvg';

interface IArbitrageButtonsProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class ArbitrageSidebar extends Component<IArbitrageButtonsProps> {
	render() {
		const { MainStore } = this.props;
		const { ArbitrageStore } = this.props.MainStore;

		return (
			<aside className={styles.sidebar}>
				<section className={styles.buttonsContainer}>
					<MyButton title="Refresh Arbitrages" onClick={() => ArbitrageStore.searchAllLeagueIds()} type="primary" />
					<MyButton title="Reset Filters" onClick={() => ArbitrageStore.resetFilters()} type="default" />
					{/* <MyButton
						title="Calculate Arbitrages (From cache)"
						onClick={() => ArbitrageStore.searchAllLeagueIds(1, true)}
						type="primary"
					/> */}

					{/* List view */}
					<div onClick={() => ArbitrageStore.toggleFilterBlock('listView')} className={styles.dropdown}>
						<div>List view (2) </div>
						<div className={ArbitrageStore.openedFilterBlocks.includes('listView') && styles.rotate}>
							<ArrowRightSvg />
						</div>
					</div>
					{ArbitrageStore.openedFilterBlocks.includes('listView') && (
						<>
							<label onClick={() => ArbitrageStore.changeListView('original')} className={styles.checkboxContainer}>
								<input checked={ArbitrageStore.activeListView === 'original'} type="checkbox" />
								<div>Original</div>
							</label>
							<label onClick={() => ArbitrageStore.changeListView('betType')} className={styles.checkboxContainer}>
								<input checked={ArbitrageStore.activeListView === 'betType'} type="checkbox" />
								<div>Bet type </div>
							</label>
						</>
					)}

					{/* Parameters filter */}
					<div onClick={() => ArbitrageStore.toggleFilterBlock('parameters')} className={styles.dropdown}>
						<div>Parameters (2) </div>
						<div className={ArbitrageStore.openedFilterBlocks.includes('parameters') && styles.rotate}>
							<ArrowRightSvg />
						</div>
					</div>
					{ArbitrageStore.openedFilterBlocks.includes('parameters') && (
						<>
							<label onClick={() => ArbitrageStore.selectParameters('twoParameter')} className={styles.checkboxContainer}>
								<input checked={ArbitrageStore.selectedParameters === 'twoParameter'} type="checkbox" />
								<div>Two parameter ({ArbitrageStore.getParametersFrequency.twoParameter})</div>
							</label>
							<label onClick={() => ArbitrageStore.selectParameters('threeParameter')} className={styles.checkboxContainer}>
								<input checked={ArbitrageStore.selectedParameters === 'threeParameter'} type="checkbox" />
								<div>Three parameter ({ArbitrageStore.getParametersFrequency.threeParameter})</div>
							</label>
						</>
					)}

					{/* Arbitrage filter */}
					<div onClick={() => ArbitrageStore.toggleFilterBlock('arbitrageRanges')} className={styles.dropdown}>
						<div>Arbitrage ranges (4) </div>
						<div className={ArbitrageStore.openedFilterBlocks.includes('arbitrageRanges') && styles.rotate}>
							<ArrowRightSvg />
						</div>
					</div>

					{ArbitrageStore.openedFilterBlocks.includes('arbitrageRanges') &&
						ArbitrageStore.getArbitrageRanges.map((range) => (
							<label onClick={() => ArbitrageStore.addArbitrageRangeFilter(range)} className={styles.checkboxContainer}>
								<input checked={ArbitrageStore.activeArbitrageRangeFilter?.from === range.from} type="checkbox" />
								<div>
									{range.from} - {range.to} ({range.frequency})
								</div>
							</label>
						))}

					{/* Bookmakers filter */}
					<div onClick={() => ArbitrageStore.toggleFilterBlock('bookmakers')} className={styles.dropdown}>
						<div>Bookmakers ({ArbitrageStore.getBookmakers.length})</div>
						<div className={ArbitrageStore.openedFilterBlocks.includes('bookmakers') && styles.rotate}>
							<ArrowRightSvg />
						</div>
					</div>

					{ArbitrageStore.openedFilterBlocks.includes('bookmakers') &&
						ArbitrageStore.getBookmakers.map((item) => (
							<label onClick={() => ArbitrageStore.toggleBookmakerFilter(item[0] as string)} className={styles.checkboxContainer}>
								<input checked={ArbitrageStore.filteredBookmakers.includes(item[0])} type="checkbox" />
								<div>
									{item[0]} ({item[1]})
								</div>
							</label>
						))}

					{/* Bet type filter */}
					<div onClick={() => ArbitrageStore.toggleFilterBlock('betTypes')} className={styles.dropdown}>
						<div>
							Bet types ({(ArbitrageStore.getArbitrages.length > 0 && ArbitrageStore.getArbitrages[0]?.arbitrages?.length) ?? 0})
						</div>
						<div className={ArbitrageStore.openedFilterBlocks.includes('betTypes') && styles.rotate}>
							<ArrowRightSvg />
						</div>
					</div>

					{ArbitrageStore.openedFilterBlocks.includes('betTypes') &&
						ArbitrageStore.getBetTypes.map((item) => (
							<label onClick={() => ArbitrageStore.toggleBetTypeFilter(item[0] as string)} className={styles.checkboxContainer}>
								<input checked={ArbitrageStore.filteredBetTypes.includes(item[0])} type="checkbox" />
								<div>
									{item[0]} ({item[1]})
								</div>
							</label>
						))}
				</section>
			</aside>
		);
	}
}

export default ArbitrageSidebar;

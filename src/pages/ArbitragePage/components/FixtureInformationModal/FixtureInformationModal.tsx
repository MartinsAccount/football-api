import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { MainStore } from '../../../../stores/MainStore';
import { IHighestOdds } from '../../models/models';
import styles from './FixtureInformationModal.module.scss';

interface IFixtureInformationModalProps {
	MainStore?: MainStore;
}

@inject('MainStore')
@observer
class FixtureInformationModal extends Component<IFixtureInformationModalProps> {
	render() {
		const { ArbitrageStore } = this.props.MainStore;

		console.log('render FixtureInformationModal');

		return (
			<article className={styles.modalContainer}>
				{ArbitrageStore.isLoadingFixtureInformation ? (
					<div className={styles.loading}>
						<div className={styles.ldsRing}>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
						<h2>{this.props.MainStore.loadingText ?? 'Loading...'}</h2>
					</div>
				) : (
					<div className={styles.wrapper}>
						<div className={styles.closeButton} onClick={() => ArbitrageStore.setIsOpenFixtureInformationModal(false)}>
							X
						</div>

						<div className={styles.fixtureInformationsContainer}>
							<div className={styles.fixtureTeams}>
								<div style={{ fontWeight: 'bold' }}>Country:</div>
								<div>{ArbitrageStore.fixtureInformation.league.country}</div>
							</div>
							<div className={styles.fixtureTeams}>
								<div style={{ fontWeight: 'bold' }}>League:</div>
								<div>{ArbitrageStore.fixtureInformation.league.name}</div>
							</div>
							<div className={styles.fixtureTeams}>
								<div style={{ fontWeight: 'bold' }}>Teams:</div>
								<div>{ArbitrageStore.fixtureInformation.teams.home.name}</div>
								<div> - </div>
								<div>{ArbitrageStore.fixtureInformation.teams.away.name}</div>
							</div>
							<div className={styles.fixtureTeams}>
								<div style={{ fontWeight: 'bold' }}>Date:</div>
								<div>{new Date(ArbitrageStore.fixtureInformation.fixture.date).toLocaleString()}</div>
							</div>
						</div>

						<table>
							<tr>
								<th className={styles.cell}>Bookmaker</th>
								<th className={styles.cell}>Name</th>
								<th className={styles.cell}>Odd</th>
							</tr>
							{ArbitrageStore.selectedListItem.bookmakers.map((bookmaker: IHighestOdds, index: number) => (
								<tr key={index}>
									<td className={styles.cell}>{bookmaker?.bookmaker}</td>
									<td className={styles.cell}>{bookmaker?.name}</td>
									<td className={styles.cell}>{bookmaker?.odd}</td>
								</tr>
							))}
						</table>
					</div>
				)}
			</article>
		);
	}
}

export default FixtureInformationModal;

import React, { Component } from 'react';
import styles from './MyButton.module.scss';

interface IMyButtonProps {
	title: string;
	type: 'default' | 'primary';
	onClick: () => void;
	active: boolean;
}

export default class MyButton extends Component<IMyButtonProps> {
	static defaultProps = {
		type: 'default',
		active: false
	};

	render() {
		const { title, type, onClick, active } = this.props;

		return (
			<button
				className={`${type === 'primary' ? styles.primaryButton : styles.defaultButton} ${active && styles.active}`}
				onClick={onClick}
			>
				{title}
			</button>
		);
	}
}

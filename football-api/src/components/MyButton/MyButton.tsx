import React, { Component } from 'react';
import styles from './MyButton.module.scss';

interface IMyButtonProps {
	title: string;
	type: 'default' | 'primary';
	onClick: () => void;
}

export default class MyButton extends Component<IMyButtonProps> {
	static defaultProps = {
		type: 'default'
	};

	render() {
		const { title, type, onClick } = this.props;

		return (
			<button className={type === 'primary' ? styles.primaryButton : styles.defaultButton} onClick={onClick}>
				{title}
			</button>
		);
	}
}

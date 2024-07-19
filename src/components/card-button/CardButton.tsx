import React from "react";

interface CardButtonProps {
	Icon?: any;
	style?: string;
	size?: number;
	handleOnClick: () => void;
}

const CardButton = ({ Icon, style, size, handleOnClick }: CardButtonProps) => {
	return (
		<button className={style}>
			<Icon size={size} onClick={handleOnClick} />
		</button>
	);
};

export default CardButton;

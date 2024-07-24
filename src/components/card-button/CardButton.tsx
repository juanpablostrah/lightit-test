import React from "react";

interface CardButtonProps {
	Icon?: any;
	className?: string;
	size?: number;
	handleOnClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const CardButton = ({
	Icon,
	className,
	size,
	handleOnClick,
}: CardButtonProps) => {
	return (
		<button className={className}>
			<Icon size={size} onClick={handleOnClick} />
		</button>
	);
};

export default CardButton;

import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaChevronDown, FaChevronUp, FaRegTrashAlt } from "react-icons/fa";
import { Patient } from "../../../PatientContext";
import CardButton from "../../card-button/CardButton";
import "./PatientCard.css";

interface PatientCardProps {
	patient: Patient;
	onDelete: () => void;
	onEdit: (newPatient: Patient) => void;
	onClick: () => void;
}

const PatientCard = ({ patient, onDelete, onClick }: PatientCardProps) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	const handleEditClick = () => {
		onClick();
	};

	const toggleExpand = () => {
		setExpanded(!expanded);
	};

	return (
		<div className="card">
			<div>
				<div className="flex-evenly">
					<img src={patient.avatar} alt={patient.name} className="avatar" />
					<p className="name">{patient.name}</p>
				</div>

				{expanded && <p>{patient.description}</p>}
				<div className="icons-container">
					<CardButton
						Icon={FaRegTrashAlt}
						size={15}
						handleOnClick={onDelete}
						style={"icon trash-icon"}
					/>

					<CardButton
						Icon={CiEdit}
						size={20}
						handleOnClick={handleEditClick}
						style={"icon edit-icon"}
					/>

					<CardButton
						Icon={expanded ? FaChevronUp : FaChevronDown}
						size={20}
						handleOnClick={toggleExpand}
						style={"icon expand-icon"}
					/>
				</div>
			</div>
		</div>
	);
};

export default PatientCard;

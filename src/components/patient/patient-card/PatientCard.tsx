import React from "react";
import { CiEdit } from "react-icons/ci";
import { FaChevronDown, FaChevronUp, FaRegTrashAlt } from "react-icons/fa";
import { Patient, usePatientContext } from "../../../PatientContext";
import CardButton from "../../card-button/CardButton";
import "./PatientCard.css";

interface PatientCardProps {
	patient: Patient;
	onDelete: () => void;
	onEdit: (newPatient: Patient) => void;
	onClick: () => void;
}

const PatientCard = ({ patient, onDelete, onClick }: PatientCardProps) => {
	const { patientCardExpandedId, setPatientCardExpandedId } =
		usePatientContext();

	const handleEditClick = () => {
		onClick();
	};

	const isExpanded = patientCardExpandedId === patient.id;

	const toggleExpand = () => {
		setPatientCardExpandedId(isExpanded ? undefined : patient.id);
	};

	return (
		<div>
			<div className="card">
				<div>
					<div className="flex-evenly">
						<img src={patient.avatar} alt={patient.name} className="avatar" />
						<p className="name">{patient.name}</p>
					</div>

					{isExpanded && <p>{patient.description}</p>}
					<div className="icons-container">
						<CardButton
							Icon={FaRegTrashAlt}
							size={15}
							handleOnClick={onDelete}
							className={"icon trash-icon"}
						/>

						<CardButton
							Icon={CiEdit}
							size={20}
							handleOnClick={handleEditClick}
							className={"icon edit-icon"}
						/>

						<CardButton
							Icon={isExpanded ? FaChevronUp : FaChevronDown}
							size={20}
							handleOnClick={toggleExpand}
							className={"icon expand-icon"}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PatientCard;

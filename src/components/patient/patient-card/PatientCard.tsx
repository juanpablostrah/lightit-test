import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import CardButton from "../../card-button/CardButton";
import { Patient } from "../patient-list/PatientList";
import "./PatientCard.css";

interface PatientCardProps {
	patient: Patient;
	onDelete: () => void;
	onEdit: (newPatient: Patient) => void;
}

const PatientCard = ({ patient, onDelete, onEdit }: PatientCardProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editedpatient, setEditedPatient] = useState<Patient>(patient);
	const [expanded, setExpanded] = useState<boolean>(false);

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSaveClick = () => {
		onEdit(editedpatient);
		setIsEditing(false);
	};

	const handleCancelClick = () => {
		setIsEditing(false);
		setEditedPatient(patient);
	};

	const toggleExpand = () => {
		setExpanded(!expanded);
	};

	return (
		<div className="card">
			{isEditing ? (
				<div>
					<textarea
						className="text-area-edit"
						value={editedpatient.description}
						onChange={(e) =>
							setEditedPatient((prevPatient) => ({
								...prevPatient,
								description: e.target.value,
							}))
						}
					/>
					<div>
						<button className={"button-footer save"} onClick={handleSaveClick}>
							Guardar
						</button>
						<button
							className={"button-footer cancel"}
							onClick={handleCancelClick}
						>
							Cancelar
						</button>
					</div>
				</div>
			) : (
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

						<button className="icon expand-icon" onClick={toggleExpand}>
							{expanded ? (
								<FaChevronUp size={20} />
							) : (
								<FaChevronDown size={20} />
							)}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default PatientCard;

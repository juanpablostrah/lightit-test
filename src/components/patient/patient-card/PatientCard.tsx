import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaChevronDown, FaChevronUp, FaRegTrashAlt } from "react-icons/fa";
import { Patient } from "../../../PatientContext";
import useTextareaAutoHeight from "../../../utils/useTextareaAutoHeight";
import { errorMessages } from "../../../utils/validations";
import CardButton from "../../card-button/CardButton";
import "./PatientCard.css";

interface PatientCardProps {
	patient: Patient;
	onDelete: () => void;
	onEdit: (newPatient: Patient) => void;
}

const PatientCard = ({ patient, onDelete, onEdit }: PatientCardProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editedPatient, setEditedPatient] = useState<Patient>(patient);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [descriptionError, setDescriptionError] = useState<string>("");
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const { textareaRef, adjustTextareaHeight } = useTextareaAutoHeight(
		editedPatient.description
	);

	useEffect(() => {
		if (isEditing) {
			adjustTextareaHeight();
		}
	}, [isEditing, adjustTextareaHeight]);

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSaveClick = () => {
		const errorMessage = getErrorMessage(editedPatient.description);
		if (errorMessage) {
			setDescriptionError(errorMessage);
			return;
		}
		onEdit(editedPatient);
		setIsEditing(false);
		setDescriptionError("");
	};

	const handleCancelClick = () => {
		setIsEditing(false);
		setEditedPatient(patient);
		setDescriptionError("");
	};

	const toggleExpand = () => {
		setExpanded(!expanded);
	};

	const getErrorMessage = (description: string): string => {
		if (description.length < 10) {
			return errorMessages.description.minLength || "";
		}
		if (description.length > 1000) {
			return errorMessages.description.maxLength || "";
		}
		return "";
	};

	//agregar manejo de errores similar al form del modal
	return (
		<div className="card">
			{isEditing ? (
				<div>
					<div className="input-container">
						<input
							className="input-card"
							value={editedPatient.name}
							onChange={(e) =>
								setEditedPatient((prevPatient) => ({
									...prevPatient,
									name: e.target.value,
								}))
							}
						/>
					</div>
					<div className="input-container">
						<textarea
							className="text-area-edit"
							ref={textareaRef}
							value={editedPatient.description}
							onChange={(e) =>
								setEditedPatient((prevPatient) => ({
									...prevPatient,
									description: e.target.value,
								}))
							}
						/>
						{descriptionError && (
							<p className="error-message">{descriptionError}</p>
						)}
					</div>
					<div>
						<button className={"button-footer save"} onClick={handleSaveClick}>
							Save
						</button>
						<button
							className={"button-footer cancel"}
							onClick={handleCancelClick}
						>
							Cancel
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

						<CardButton
							Icon={expanded ? FaChevronUp : FaChevronDown}
							size={20}
							handleOnClick={toggleExpand}
							style={"icon expand-icon"}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default PatientCard;

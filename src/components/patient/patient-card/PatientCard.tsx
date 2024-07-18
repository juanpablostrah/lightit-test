import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import "./PatientCard.css";

interface PatientCardProps {
	patient: string;
	onDelete: () => void;
	onEdit: (newPatient: string) => void;
}

const PatientCard = ({ patient, onDelete, onEdit }: PatientCardProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editedpatient, setEditedPatient] = useState<string>(patient);

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSaveClick = () => {
		onEdit(editedpatient);
		setIsEditing(false);
		if (editedpatient.length === 0) {
			onDelete();
		}
	};

	const handleCancelClick = () => {
		setIsEditing(false);
		setEditedPatient(patient);
	};

	return (
		<div className="card">
			{isEditing ? (
				<div>
					<textarea
						className="text-area-edit"
						value={editedpatient}
						onChange={(e) => setEditedPatient(e.target.value)}
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
					<p>{`"${patient}"`}</p>
					<button className="icon trash-icon">
						<FaRegTrashAlt size={15} onClick={onDelete} />
					</button>

					<button className="icon edit-icon">
						<CiEdit size={20} onClick={handleEditClick} />
					</button>
				</div>
			)}
		</div>
	);
};

export default PatientCard;

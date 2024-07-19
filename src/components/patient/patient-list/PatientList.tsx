import React, { useEffect, useState } from "react";
import PatientCard from "../patient-card/PatientCard";
import "./PatientList.css";

interface PatientListProps {
	patients: Patient[];
	onDelete: (index: number) => void;
	onEdit: (index: number, newPatient: Patient) => void;
	originalPatients: Patient[];
}

export interface Patient {
	name: string;
	description: string;
	avatar: string;
	id: string;
}

const PatientList = ({
	patients,
	onDelete,
	onEdit,
	originalPatients,
}: PatientListProps) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	return (
		<div className="card-list">
			{patients.map((patient) => {
				const originalIndex = originalPatients.indexOf(patient);
				return (
					<PatientCard
						key={patient.id}
						patient={patient}
						onDelete={() => onDelete(originalIndex)}
						onEdit={(newPatient) => onEdit(originalIndex, newPatient)}
					/>
				);
			})}
		</div>
	);
};

export default PatientList;

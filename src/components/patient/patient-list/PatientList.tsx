import React, { useState } from "react";
import PatientCard from "../patient-card/PatientCard";
import "./PatientList.css";

interface PatientListProps {
	patients: string[];
	onDelete: (index: number) => void;
	onEdit: (index: number, newPatient: string) => void;
	originalPatients: string[];
}

interface Patient {
	id: number;
	name: string;
	age: number;
	condition: string;
}

const CardList = ({
	patients,
	onDelete,
	onEdit,
	originalPatients,
}: PatientListProps) => {
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	return (
		<div className="card-list">
			{patients.map((patient, index) => {
				const originalIndex = originalPatients.indexOf(patient);
				return (
					<PatientCard
						key={index}
						patient={patient}
						onDelete={() => onDelete(originalIndex)}
						onEdit={(newPatient) => onEdit(originalIndex, newPatient)}
					/>
				);
			})}
		</div>
	);
};

export default CardList;

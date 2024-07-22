import React from "react";
import { Patient, usePatientContext } from "../../../PatientContext";
import PatientCard from "../patient-card/PatientCard";
import "./PatientList.css";

const PatientList = () => {
	const { filteredPatients, deletePatient, editPatient, patients } =
		usePatientContext();

	const handleDelete = (index: number) => {
		deletePatient(index);
	};

	const handleEdit = (index: number, newPatient: Patient) => {
		editPatient(index, newPatient);
	};

	return (
		<div className="card-list">
			{filteredPatients.map((patient) => {
				const originalIndex = patients.findIndex((p) => p.id === patient.id);
				return (
					<PatientCard
						key={patient.id}
						patient={patient}
						onDelete={() => handleDelete(originalIndex)}
						onEdit={(newPatient) => handleEdit(originalIndex, newPatient)}
					/>
				);
			})}
		</div>
	);
};

export default PatientList;

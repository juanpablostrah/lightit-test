import React, { useState, useEffect } from "react";
import PatientCard from "../patient-card/PatientCard";
import PatientModal from "../patient-modal/PatientModal";
import "./PatientList.css";

interface Patient {
	id: number;
	name: string;
	age: number;
	condition: string;
}

const PatientList: React.FC = () => {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	useEffect(() => {
		fetch("https://63bedcf7f5cfc0949b634fc8.mockapi.io/users")
			.then((response) => response.json())
			.then((data) => setPatients(data))
			.catch((error) => console.error("Error fetching patients:", error));
	}, []);

	const handleOpenModal = (patient: Patient | null = null) => {
		setSelectedPatient(patient);
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	const handleSave = (patient: Patient) => {
		if (selectedPatient) {
			setPatients(
				patients.map((p) => (p.id === selectedPatient.id ? patient : p))
			);
		} else {
			setPatients([...patients, { ...patient, id: patients.length + 1 }]);
		}
		handleCloseModal();
	};

	return (
		<div>
			<button onClick={() => handleOpenModal()}>Add Patient</button>
			<div className="patient-list">
				{patients.map((patient) => (
					<PatientCard
						key={patient.id}
						patient={patient}
						onEdit={() => handleOpenModal(patient)}
					/>
				))}
			</div>
			{modalOpen && (
				<PatientModal
					patient={selectedPatient}
					onSave={handleSave}
					onClose={handleCloseModal}
				/>
			)}
		</div>
	);
};

export default PatientList;

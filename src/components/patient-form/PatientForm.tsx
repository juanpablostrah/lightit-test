import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { Patient, usePatientContext } from "../../PatientContext";
import PatientModal from "../patient-modal/PatientModal";
import { useDebouncedCallback } from "use-debounce";
import "./PatientForm.css";

const PatientForm = () => {
	const { addPatient, setSearchPatient } = usePatientContext();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

	const timeAwaitToSearch: number = 500;

	const debounceSearch = useDebouncedCallback((searchPatiant) => {
		setSearchPatient(searchPatiant);
	}, timeAwaitToSearch);

	const handleAddPatient = (patient: Patient) => {
		addPatient(patient);
		toast.success("Patient created!", { duration: 4000 });
		setIsModalOpen(false);
	};

	const handleOpenModal = () => {
		setEditingPatient(null);
		setIsModalOpen(true);
	};

	return (
		<div>
			<div className="flex-center">
				<input
					className="input"
					placeholder="Search your patient by name..."
					onChange={(e) => debounceSearch(e.target.value)}
				/>
			</div>
			<button className="floating-button" onClick={handleOpenModal}>
				<FaPlus />
			</button>
			{isModalOpen && (
				<PatientModal
					patient={editingPatient}
					onSave={handleAddPatient}
					onClose={() => setIsModalOpen(false)}
					setIsModalOpen={setIsModalOpen}
				/>
			)}
		</div>
	);
};

export default PatientForm;

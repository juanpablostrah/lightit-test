import React from "react";
import { FaPlus } from "react-icons/fa";
import { useDebouncedCallback } from "use-debounce";
import { Patient, usePatientContext } from "../../../PatientContext";
import PatientModal from "../patient-modal/PatientModal";
import "./PatientForm.css";

interface PatientFormProps {
	isModalOpen: boolean;
	setIsModalOpen: (boolean: boolean) => void;
	editingPatient: Partial<Patient> | undefined;
	setEditingPatient: (patient: Partial<Patient> | undefined) => void;
}

const PatientForm = ({
	isModalOpen,
	setIsModalOpen,
	editingPatient,
	setEditingPatient,
}: PatientFormProps) => {
	const { setSearchPatient } = usePatientContext();

	const timeAwaitToSearch: number = 500;

	const debounceSearch = useDebouncedCallback((searchPatiant) => {
		setSearchPatient(searchPatiant);
	}, timeAwaitToSearch);

	const handleOpenModal = () => {
		setEditingPatient(undefined);
		setIsModalOpen(true);
	};

	return (
		<div>
			<div className="flex-center">
				<input
					className="input"
					placeholder="Search your patient by name..."
					onChange={(e) => debounceSearch(e.target.value)}
					onBlur={() => 1}
				/>
			</div>
			<button className="floating-button" onClick={handleOpenModal}>
				<FaPlus />
			</button>
			{isModalOpen && (
				<PatientModal
					initial={editingPatient || {}}
					onClose={() => setIsModalOpen(false)}
					onDismiss={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default PatientForm;

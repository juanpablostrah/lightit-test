import React, { useEffect, useState } from "react";
import { Patient, usePatientContext } from "../../../PatientContext";
import PatientCard from "../patient-card/PatientCard";
import "./PatientList.css";

const ITEMS_PER_PAGE = 12;

const PatientList = () => {
	const { filteredPatients, deletePatient, editPatient, patients } =
		usePatientContext();
	const [currentPage, setCurrentPage] = useState<number>(1);

	useEffect(() => {
		setCurrentPage(1);
	}, [filteredPatients]);
	const totalItems = filteredPatients.length;
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

	const handleDelete = (index: number) => {
		deletePatient(index);
	};

	const handleEdit = (index: number, newPatient: Patient) => {
		editPatient(index, newPatient);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
	const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

	return (
		<>
			{totalItems === 0 ? (
				<p className="no-patients-message">No patients found</p>
			) : (
				<>
					<div className="card-list">
						{paginatedPatients.map((patient) => {
							const originalIndex = patients.findIndex(
								(p) => p.id === patient.id
							);
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

					<div className="pagination-controls">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Previous
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</button>
					</div>
				</>
			)}
		</>
	);
};

export default PatientList;

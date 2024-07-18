import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./App.css";
import PatientList from "./components/patient/patient-list/PatientList";
import PatiantForm from "./components/patient-form/PatientForm";
import {
	addPatient,
	deletePatient as deletePatiant,
	editPatient,
} from "./utils/patientUtils";

function App() {
	const [patients, setPatients] = useState<string[]>([]);
	const [filteredPatients, setFilteredPatients] = useState<string[]>([]);
	const [searchPatient, setSearchPatient] = useState<string>("");

	const timeAwaitToSearch: number = 2000;

	useEffect(() => {
		setFilteredPatients(
			patients.filter((patient) =>
				patient.toLowerCase().includes(searchPatient.toLowerCase())
			)
		);
	}, [searchPatient, patients]);

	const handleAddPatient = (patient: string) => {
		const updatedPatiants = addPatient(patients, patient);
		setPatients(updatedPatiants);
	};

	const handleEditPatient = (index: number, newPatiant: string) => {
		const updatedPatiants = editPatient(patients, index, newPatiant);
		setPatients(updatedPatiants);
	};

	const handleDeletePatiant = (index: number) => {
		const updatedPatiants = deletePatiant(patients, index);
		setPatients(updatedPatiants);
	};

	const debounceSearch = useDebouncedCallback((searchPatiant) => {
		setSearchPatient(searchPatiant);
	}, timeAwaitToSearch);

	return (
		<div className="App">
			<header>
				<h2 className="title">Patient List</h2>
				<PatiantForm addPatient={handleAddPatient} onChange={debounceSearch} />
			</header>
			<main>
				<PatientList
					patients={filteredPatients}
					originalPatients={patients}
					onDelete={handleDeletePatiant}
					onEdit={handleEditPatient}
				/>
			</main>
		</div>
	);
}

export default App;

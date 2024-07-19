import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./App.css";
import PatientList, {
	Patient,
} from "./components/patient/patient-list/PatientList";
import PatiantForm from "./components/patient-form/PatientForm";
import {
	addPatient,
	deletePatient as deletePatiant,
	editPatient,
} from "./utils/patientUtils";

function App() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
	const [searchPatient, setSearchPatient] = useState<string>("");

	const timeAwaitToSearch: number = 2000;

	useEffect(() => {
		fetch("https://63bedcf7f5cfc0949b634fc8.mockapi.io/users")
			.then((response) => response.json())
			.then((data) => setPatients(data))
			.catch((error) => console.error("Error fetching patients:", error));
	}, []);

	useEffect(() => {
		setFilteredPatients(
			patients.filter((patient) =>
				patient.name.toLowerCase().includes(searchPatient.toLowerCase())
			)
		);
	}, [searchPatient, patients]);

	const handleAddPatient = (patient: Patient) => {
		const updatedPatiants = addPatient(patients, patient);
		console.log("updatedPatiants: ", updatedPatiants);
		setPatients(updatedPatiants);
	};

	const handleEditPatient = (index: number, newPatiant: Patient) => {
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
				<PatiantForm
					addPatient={handleAddPatient}
					onChange={debounceSearch}
					patients={patients}
				/>
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

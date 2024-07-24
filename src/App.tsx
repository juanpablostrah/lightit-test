import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import PatiantForm from "./components/patient/patient-form/PatientForm";
import PatientList from "./components/patient/patient-list/PatientList";
import { Patient } from "./PatientContext";

/**
 * React: Main library for building the user interface.
 * typescript: to can catch compilation errors.
 * React Icons: For adding icons easily and consistently.
 * react Hot Toast: For displaying success and error notifications.
 * Custom Hooks: Custom hooks, such as useTextareaAutoHeight, are created to enhance functionality and user experience./**
 
/**Well i decided to display the cards like a grid, i think it was the better aproach to can show it **/

/** Used a debounce function when filtering patients in a list is a good practice for several reasons, especially in scenarios where the list could be very large, 
potentially containing millions of patients. Without debounce, every keystroke in the search input would 
trigger the filter function. This means if a user types quickly, the filter function could be called hundreds of times in a very short period.**/

/** Used Context api to handle the global state to avoid prop drilling **/

/** semantic commits **/

function App() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [editingPatient, setEditingPatient] = useState<
		Partial<Patient> | undefined
	>();
	return (
		<div className="App">
			<header>
				<h2 className="title">Patient List</h2>
				<Toaster />
				<PatiantForm
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					editingPatient={editingPatient}
					setEditingPatient={setEditingPatient}
				/>
			</header>
			<main>
				<PatientList
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					editingPatient={editingPatient}
					setEditingPatient={setEditingPatient}
				/>
			</main>
		</div>
	);
}

export default App;

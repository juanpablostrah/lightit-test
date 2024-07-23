import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import PatiantForm from "./components/patient-form/PatientForm";
import PatientList from "./components/patient/patient-list/PatientList";
import { Patient } from "./PatientContext";

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

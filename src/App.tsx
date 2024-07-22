import React from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import PatiantForm from "./components/patient-form/PatientForm";
import PatientList from "./components/patient/patient-list/PatientList";
import { usePatientContext } from "./PatientContext";

function App() {
	return (
		<div className="App">
			<header>
				<h2 className="title">Patient List</h2>
				<h4 className="title">
					please enter the information to create a new patient
				</h4>
				<Toaster />
				<PatiantForm />
			</header>
			<main>
				<PatientList />
			</main>
		</div>
	);
}

export default App;

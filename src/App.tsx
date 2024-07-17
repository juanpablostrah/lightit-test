import React from "react";
import PatientList from "./components/patient-list/PatientList";

const App: React.FC = () => {
	return (
		<div className="App">
			<h1>Patient Management</h1>
			<PatientList />
		</div>
	);
};

export default App;

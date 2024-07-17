import React, { useState } from "react";
import "./PatientCard.css";

interface Patient {
	id: number;
	name: string;
	age: number;
	condition: string;
}

interface PatientCardProps {
	patient: Patient;
	onEdit: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onEdit }) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<div className="patient-card">
			<h3>{patient.name}</h3>
			<button onClick={() => setExpanded(!expanded)}>
				{expanded ? "Collapse" : "Expand"}
			</button>
			<button onClick={onEdit}>Edit</button>
			{expanded && (
				<div className="patient-details">
					<p>Age: {patient.age}</p>
					<p>Condition: {patient.condition}</p>
				</div>
			)}
		</div>
	);
};

export default PatientCard;

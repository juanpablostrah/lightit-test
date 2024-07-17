import React, { useState } from "react";
import "./PatientModal.css";

interface Patient {
	id?: number;
	name: string;
	age: number;
	condition: string;
}

interface PatientModalProps {
	patient: Patient | null;
	onSave: (patient: Patient | any) => void;
	onClose: () => void;
}

const PatientModal: React.FC<PatientModalProps> = ({
	patient,
	onSave,
	onClose,
}) => {
	const [formData, setFormData] = useState<Patient>({
		name: patient?.name || "",
		age: patient?.age || 0,
		condition: patient?.condition || "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = () => {
		onSave(formData);
	};

	return (
		<div className="modal">
			<div className="modal-content">
				<h2>{patient ? "Edit Patient" : "Add Patient"}</h2>
				<label>
					Name:
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
					/>
				</label>
				<label>
					Age:
					<input
						type="number"
						name="age"
						value={formData.age}
						onChange={handleChange}
					/>
				</label>
				<label>
					Condition:
					<input
						type="text"
						name="condition"
						value={formData.condition}
						onChange={handleChange}
					/>
				</label>
				<button onClick={handleSubmit}>Save</button>
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};

export default PatientModal;

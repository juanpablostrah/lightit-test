import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Patient } from "../patient/patient-list/PatientList";
import "./PatientForm.css";

interface PatientFormProps {
	addPatient: (patient: Patient) => void;
	onChange: (value: string) => void;
	patients: Patient[];
}

const defaultPatient: Patient = {
	id: "0",
	name: "",
	description: "",
	avatar: "",
};

const PatiantForm = ({ addPatient, onChange, patients }: PatientFormProps) => {
	const [patient, setPatient] = useState<Patient>(defaultPatient);
	const [hasPatient, setHasPatient] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		adjustTextareaHeight();
	}, [patient]);

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	const getNextPatientId = () => {
		if (patients.length === 0) return "1";
		const lastPatient = patients[patients.length - 1];
		const lastId = parseInt(lastPatient.id);
		return (lastId + 1).toString();
	};

	const handleAddPatient = () => {
		// if (patient.name.length > 0) {
		// 	if (patient.name.trim()) {
		const newId = getNextPatientId();
		const newPatient = {
			...patient,
			id: getNextPatientId(),
		};
		console.log("newId: ", newId);
		addPatient(newPatient);
		setHasPatient(false);
		setPatient(defaultPatient);
		// 	}
		// } else {
		// 	setHasPatient(true);
		// }
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleAddPatient();
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPatient((prevPatient) => ({
					...prevPatient,
					avatar: reader.result as string,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="">
			<div className="flex-center">
				<form className="flex-column" action="">
					<div className="flex align-center m-left m-bottom">
						<label className="label">Name:</label>
						<input
							className="input"
							placeholder="patient name"
							onChange={(e) =>
								setPatient((prevPatient) => ({
									...prevPatient,
									name: e.target.value,
								}))
							}
						/>
					</div>
					<div className="flex align-center m-left">
						<label className="label">Description:</label>
						<textarea
							ref={textareaRef}
							className={`textarea ${hasPatient ? "error" : ""}`}
							placeholder="patient description..."
							value={patient.description}
							onChange={(e) =>
								setPatient((prevPatient) => ({
									...prevPatient,
									description: e.target.value,
								}))
							}
							onKeyDown={handleKeyDown}
						/>
					</div>
					<div className="flex align-center m-left">
						<label className="label" htmlFor="image-upload">
							<input
								type="file"
								ref={fileInputRef}
								style={{ display: "none" }}
								onChange={handleFileChange}
							/>
							<button type="button" onClick={handleButtonClick}>
								Subir imagen
							</button>
						</label>
						{patient.avatar && (
							<div className="flex justify-center">
								<img
									className="avatar-form"
									src={patient.avatar}
									alt="avatar"
								/>
							</div>
						)}
					</div>
					<div>
						<button type="button" className="button" onClick={handleAddPatient}>
							Add patient
							<FaPlus size={20} />
						</button>
					</div>
				</form>

				{hasPatient && (
					<p className="warning-message">ingresa algun paciente</p>
				)}
			</div>
			<input
				className="input"
				placeholder="Search your patient by name..."
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
};

export default PatiantForm;

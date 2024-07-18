import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./PatientForm.css";

interface PatientFormProps {
	addPatient: (patient: string) => void;
	onChange: (value: string) => void;
}

const PatiantForm = ({ addPatient, onChange }: PatientFormProps) => {
	const [patient, setPatient] = useState<string>("");
	const [hasPatient, setHasPatient] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
	const handleAddPatient = () => {
		if (patient.length > 0) {
			if (patient.trim()) {
				addPatient(patient);
				setHasPatient(false);
				setPatient("");
			}
		} else {
			setHasPatient(true);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleAddPatient();
		}
	};

	return (
		<div className="flex-column">
			<div>
				<div className="input-div">
					<form action="">
						<textarea
							ref={textareaRef}
							className={`textarea ${hasPatient ? "error" : ""}`}
							placeholder="Por favor ingresa al paciente que desea agregar"
							value={patient}
							onChange={(e) => setPatient(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<button className="button" onClick={handleAddPatient}>
							<FaPlus size={20} />
						</button>
					</form>
				</div>
				{hasPatient && (
					<p className="warning-message">ingresa algun paciente</p>
				)}
				<input
					className="input"
					placeholder="Busca tu paciente..."
					onChange={(e) => onChange(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default PatiantForm;

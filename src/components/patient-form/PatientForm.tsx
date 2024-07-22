import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { Patient, usePatientContext } from "../../PatientContext";
import useTextareaAutoHeight from "../../utils/useTextareaAutoHeight";
import { validateField, validateForm } from "../../utils/validations";
import CardButton from "../card-button/CardButton";
import { useDebouncedCallback } from "use-debounce";
import "./PatientForm.css";
import PatientModal from "../patient-modal/PatientModal";

const defaultPatient: Patient = {
	id: "0",
	name: "",
	description: "",
	avatar: "",
};

const PatientForm = () => {
	const { addPatient, patients, setSearchPatient } = usePatientContext();
	const [patient, setPatient] = useState<Patient>(defaultPatient);
	const [hasPatient, setHasPatient] = useState<boolean>(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const fileInputRef = useRef<HTMLInputElement>(null);
	const { textareaRef } = useTextareaAutoHeight(patient.description);
	const timeAwaitToSearch: number = 500;

	const debounceSearch = useDebouncedCallback((searchPatiant) => {
		setSearchPatient(searchPatiant);
	}, timeAwaitToSearch);

	const getNextPatientId = () => {
		if (patients.length === 0) return "1";
		const lastPatient = patients[patients.length - 1];
		const lastId = parseInt(lastPatient.id);
		return (lastId + 1).toString();
	};

	const getFormErrorsKeys = (formErrors: any) => {
		return Object.keys(formErrors);
	};

	const handleAddPatient = () => {
		const formErrors = validateForm(patient);
		setErrors(formErrors);
		const errors = Object.keys(formErrors).length;

		if (errors === 0) {
			const newPatient = {
				...patient,
				id: getNextPatientId(),
			};
			addPatient(newPatient);
			setHasPatient(false);
			setPatient(defaultPatient);
			toast.success("Patient created!");
		} else {
			const textErrorMessage =
				errors > 1
					? "There are errors in the fields"
					: "There is an error in the field";
			toast.error(`${textErrorMessage} ${getFormErrorsKeys(formErrors)}`, {
				duration: 8000,
			});
		}
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

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		const error = validateField(name, value);
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: error,
		}));
		setPatient((prevPatient) => ({
			...prevPatient,
			[name]: value,
		}));
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
			setErrors((prevErrors) => ({
				...prevErrors,
				avatar: "",
			}));
		}
	};

	const handleRemovePhoto = () => {
		setPatient((prevPatient) => ({
			...prevPatient,
			avatar: "",
		}));
	};

	const hasErrors = Object.keys(errors).some((key) => errors[key] !== "");

	return (
		<div>
			<div className="flex-center">
				<form className="flex-column">
					<div className="flex align-center m-left">
						<label className="label">Name:</label>
						<div>
							<input
								name="name"
								className="input"
								placeholder="Patient name"
								value={patient.name}
								onChange={handleInputChange}
							/>
							{errors.name && <p className="error-message">{errors.name}</p>}
						</div>
					</div>
					<div className="flex align-center m-left">
						<label className="label">Description:</label>
						<div>
							<textarea
								name="description"
								ref={textareaRef}
								className="textarea"
								placeholder="Patient description..."
								value={patient.description}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
							/>
							{errors.description && (
								<p className="error-message">{errors.description}</p>
							)}
						</div>
					</div>
					<div className="flex align-center m-left">
						<label className="label" htmlFor="image-upload">
							<input
								name="avatar"
								type="file"
								ref={fileInputRef}
								hidden
								onChange={handleFileChange}
							/>
							<button
								className="button  button-enabled"
								type="button"
								onClick={handleButtonClick}
							>
								Upload image
								<MdAttachFile />
							</button>
						</label>
						{patient.avatar && (
							<div className="flex m-avatar">
								<img
									className="avatar-form"
									src={patient.avatar}
									alt="avatar"
								/>
								<CardButton
									Icon={FaRegTrashAlt}
									size={15}
									handleOnClick={handleRemovePhoto}
									style={"icon remove-icon"}
								/>
							</div>
						)}
						{errors.avatar && <p className="error-message">{errors.avatar}</p>}
					</div>
					<div>
						<button
							disabled={Object.keys(errors).some((key) => errors[key] !== "")}
							type="button"
							className={hasErrors ? "button" : "button button-enabled"}
							onClick={handleAddPatient}
						>
							Add patient
							<FaPlus size={20} />
						</button>
					</div>
					<div>
						<input
							className="input"
							placeholder="Search your patient by name..."
							onChange={(e) => debounceSearch(e.target.value)}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PatientForm;

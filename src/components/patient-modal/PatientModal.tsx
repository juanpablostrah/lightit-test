import React, { useState, useEffect, useRef } from "react";
import { Patient, usePatientContext } from "../../PatientContext";
import useTextareaAutoHeight from "../../utils/useTextareaAutoHeight";
import { validateField, validateForm } from "../../utils/validations";
import "./PatientModal.css";
import toast from "react-hot-toast";
import { MdAttachFile } from "react-icons/md";
import CardButton from "../card-button/CardButton";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
interface PatientModalProps {
	patient: Patient | null;
	onSave: (patient: Patient) => void;
	onClose: () => void;
	setIsModalOpen: (open: boolean) => void;
}

export const placeholderPicture =
	"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9cSGzVkaZvJD5722MU5A-JJt_T5JMZzotcw&s";

const defaultPatient: Patient = {
	id: "0",
	name: "",
	description: "",
	avatar: placeholderPicture,
};

const PatientModal: React.FC<PatientModalProps> = ({
	onClose,
	setIsModalOpen,
}) => {
	const [formData, setFormData] = useState<Patient>(defaultPatient); //ver formData q hacer
	const [patient, setPatient] = useState<Patient>(defaultPatient);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const modalRef = useRef<HTMLDivElement>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const { textareaRef } = useTextareaAutoHeight(patient.description);
	const { addPatient, patients } = usePatientContext();

	// useEffect(() => {
	// 	if (patient) {
	// 		setFormData(patient);
	// 	} else {
	// 		setFormData(defaultPatient);
	// 	}
	// }, [patient]);

	const handleClickOutside = (e: MouseEvent) => {
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			onClose();
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

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
		if (patient.avatar === placeholderPicture) {
			setErrors((prevErrors) => ({
				...prevErrors,
				avatar: "Please select a picture",
			}));
		}
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
			avatar: placeholderPicture,
		}));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleAddPatient();
		}
	};

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
			setPatient(defaultPatient);
			setIsModalOpen(false);
			toast.success("Patient created!", { duration: 4000 });
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

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleClose = () => {
		setIsModalOpen(false);
	};

	const hasErrors = Object.keys(errors).some((key) => errors[key] !== "");

	return (
		<div className="modal">
			<div className="modal-content" ref={modalRef}>
				<h4 className="title">
					please enter the information to create a new patient
				</h4>
				<form className="flex-column">
					<div className="input-container">
						<div className="flex align-center m-left m-right">
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
					</div>

					<div className="input-container">
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
					</div>

					<div className="input-container">
						<div className="">
							<label htmlFor="image-upload">
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
									{patient.avatar !== placeholderPicture && (
										<CardButton
											Icon={FaRegTrashAlt}
											size={15}
											handleOnClick={handleRemovePhoto}
											style={"icon remove-icon"}
										/>
									)}
								</div>
							)}
							{errors.avatar && (
								<p className="error-message">{errors.avatar}</p>
							)}
						</div>
					</div>

					<div>
						<button
							disabled={Object.keys(errors).some((key) => errors[key] !== "")}
							type="button"
							className={hasErrors ? "button" : "button button-enabled"}
							onClick={handleAddPatient}
						>
							Add patient
						</button>
						<button
							disabled={Object.keys(errors).some((key) => errors[key] !== "")}
							type="button"
							className={hasErrors ? "button" : "button button-enabled"}
							onClick={handleClose}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PatientModal;

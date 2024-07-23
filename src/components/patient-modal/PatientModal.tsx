import React, { useState, useEffect, useRef } from "react";
import { Patient, usePatientContext } from "../../PatientContext";
import useTextareaAutoHeight from "../../utils/useTextareaAutoHeight";
import { validateField, validateForm } from "../../utils/validations";
import "./PatientModal.css";
import toast from "react-hot-toast";
import { MdAttachFile } from "react-icons/md";
import CardButton from "../card-button/CardButton";
import { FaRegTrashAlt } from "react-icons/fa";

interface PatientModalProps {
	initial?: Partial<Patient>;
	onClose: () => void;
	onDismiss: () => void;
}

type Errors<T> = Partial<{ [key in keyof T]: string }>;
type Blured<T> = Partial<{ [key in keyof T]: boolean }>;

export const placeholderPicture =
	"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9cSGzVkaZvJD5722MU5A-JJt_T5JMZzotcw&s";

const PatientModal: React.FC<PatientModalProps> = ({
	onClose,
	onDismiss,
	initial = {},
}) => {
	const [patient, setPatient] = useState(initial);
	const [submited, setSubmited] = useState(false);
	const [errors, setErrors] = useState<Errors<Patient>>(validateForm(initial));
	const [blured, setBlured] = useState<Blured<Patient>>({});

	const modalRef = useRef<HTMLDivElement>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const { textareaRef } = useTextareaAutoHeight(patient.description);
	const { addPatient, updatePatient } = usePatientContext();

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				onDismiss();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onDismiss]);

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

	const handleInputBlur = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name } = e.target;
		setBlured((blured) => ({
			...blured,
			[name]: true,
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
			// TODO esto es asincronico hay que convertirlo a promise para manejarlo correctamente
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
		setPatient(({ avatar, ...prevPatient }) => prevPatient);
	};

	const handleAddPatient = () => {
		setSubmited(true);
		const errorKeys = Object.keys(errors).filter(
			(key) => errors[key as keyof Patient] !== ""
		);
		if (errorKeys.length) {
			const textErrorMessage =
				errorKeys.length > 1
					? "There are errors for multiple fields"
					: "There is an error in one of the fields";
			toast.error(`${textErrorMessage}`, {
				duration: 3000,
			});
		} else {
			if (patient.id) {
				updatePatient(patient as Patient);
				toast.success("Patient updated!", { duration: 4000 });
			} else {
				addPatient(patient as Patient);
				toast.success("Patient created!", { duration: 4000 });
			}
			onClose();
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

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
									onBlur={handleInputBlur}
								/>
								{(blured.name || submited) && errors.name && (
									<p className="error-message">{errors.name}</p>
								)}
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
									onBlur={handleInputBlur}
								/>
								{(blured.description || submited) && errors.description && (
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
							<div className="flex m-avatar">
								<img
									className="avatar-form"
									src={patient.avatar || placeholderPicture}
									alt="avatar"
								/>
								{patient.avatar && (
									<CardButton
										Icon={FaRegTrashAlt}
										size={15}
										handleOnClick={handleRemovePhoto}
										style={"icon remove-icon"}
									/>
								)}
							</div>
							{(blured.avatar || submited) && errors.avatar && (
								<p className="error-message">{errors.avatar}</p>
							)}
						</div>
					</div>

					<div>
						<button
							type="button"
							className={"button button-enabled"}
							onClick={handleAddPatient}
						>
							Add patient
						</button>
						<button
							type="button"
							className={"button button-enabled"}
							onClick={onDismiss}
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

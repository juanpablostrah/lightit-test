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

export async function readFile(file: File): Promise<string> {
	const reader = new FileReader();
	return new Promise(function (resolve, reject) {
		reader.onloadend = function () {
			resolve(reader.result as string);
		};
		reader.onerror = function () {
			reject(reader.error);
		};
		reader.readAsDataURL(file);
	});
}

const PatientModal: React.FC<PatientModalProps> = ({
	onClose,
	onDismiss,
	initial = {},
}) => {
	const [patient, setPatient] = useState(initial);
	const [submited, setSubmited] = useState(false);
	const [file, setFile] = useState<File | undefined>();
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

	useEffect(() => {
		if (file) {
			let cancel = false;
			const load = async function () {
				try {
					const avatar = await readFile(file);
					if (!cancel) {
						setPatient((patient) => ({
							...patient,
							avatar,
						}));
						setErrors((errors) => ({
							...errors,
							avatar: validateField("avatar", avatar),
						}));
					}
				} catch (e) {
					toast.error("there was an error trying to read file", {
						duration: 3000,
					});
					setPatient(({ avatar, ...rest }) => rest);
					setErrors((errors) => ({
						...errors,
						avatar: validateField("avatar", undefined),
					}));
				}
				setBlured((blured) => ({
					...blured,
					avatar: true,
				}));
			};
			load();
			return () => {
				cancel = true;
			};
		}
	}, [file]);

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
		setFile(e.target.files?.[0]);
	};

	const handleRemovePhoto = () => {
		setPatient(({ avatar, ...prevPatient }) => prevPatient);
		setErrors((errors) => ({
			...errors,
			avatar: validateField("avatar"),
		}));
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
					{`please enter the information to ${
						patient.id ? "update the " : "create a new "
					}patient`}
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
						<div className="flex align-center m-left">
							<label htmlFor="image-upload">
								<label className="label">Photo:</label>
								<input
									name="avatar"
									type="file"
									ref={fileInputRef}
									hidden
									onChange={handleFileChange}
								/>
							</label>
							<div className="flex border-image">
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
										style={"icon trash-icon"}
									/>
								)}
								<div>
									<button
										className="button button-enabled"
										type="button"
										onClick={handleButtonClick}
									>
										Upload image
										<MdAttachFile />
									</button>
								</div>
								{(blured.avatar || submited) && errors.avatar && (
									<p className="error-message b-m">{errors.avatar}</p>
								)}
							</div>
						</div>
					</div>

					<div className="button-container">
						<button
							type="button"
							className="button button-cancel"
							onClick={onDismiss}
						>
							Cancel
						</button>
						<button
							type="button"
							className="button button-success"
							onClick={handleAddPatient}
						>
							{patient.id ? "Update" : "Add"} patient
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PatientModal;

import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface PatientContextProps {
	patients: Patient[];
	filteredPatients: Patient[];
	searchPatient: string;
	patientCardExpandedId: string | undefined;
	addPatient: (patient: Patient) => void;
	updatePatient: (updatedPatient: Patient) => void;
	deletePatient: (id: string) => void;
	setSearchPatient: (search: string) => void;
	setPatientCardExpandedId: (id: string | undefined) => void;
}

const PatientContext = createContext<PatientContextProps | undefined>(
	undefined
);

interface PatientProviderProps {
	children: ReactNode;
}

export interface Patient {
	name: string;
	description: string;
	avatar: string;
	id: string;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({
	children,
}) => {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
	const [searchPatient, setSearchPatient] = useState<string>("");
	const [patientCardExpandedId, setPatientCardExpandedId] = useState<
		string | undefined
	>();

	useEffect(() => {
		let cancel = false;
		async function fetchUsers() {
			try {
				const response = await fetch(
					"https://63bedcf7f5cfc0949b634fc8.mockapi.io/users"
				);
				const data = await response.json();
				if (!cancel) {
					setPatients(data);
				}
			} catch (e) {
				console.error("Error fetching patients:", e);
			}
		}
		fetchUsers();
		return function () {
			cancel = true;
		};
	}, []);

	useEffect(() => {
		setFilteredPatients(
			patients.filter((patient) =>
				patient.name.toLowerCase().includes(searchPatient.toLowerCase())
			)
		);
	}, [searchPatient, patients]);

	const addPatient = (patient: Patient) => {
		const nextPatientId = patients.length
			? patients
					.reduce(function (prev, current) {
						return Math.max(prev, parseInt(current.id));
					}, 0)
					.toString()
			: "0";
		setPatients((prevPatients) => [
			...prevPatients,
			{
				...patient,
				id: nextPatientId,
			},
		]);
	};

	const updatePatient = (updatedPatient: Patient) => {
		setPatients((prevPatients) =>
			prevPatients.map((patient) =>
				patient.id === updatedPatient.id ? updatedPatient : patient
			)
		);
	};

	const deletePatient = (id: string) => {
		setPatients((prevPatients) =>
			prevPatients.filter((patient) => patient.id !== id)
		);
	};

	return (
		<PatientContext.Provider
			value={{
				patients,
				filteredPatients,
				searchPatient,
				patientCardExpandedId,
				addPatient,
				updatePatient,
				deletePatient,
				setSearchPatient,
				setPatientCardExpandedId,
			}}
		>
			{children}
		</PatientContext.Provider>
	);
};

export const usePatientContext = () => {
	const context = useContext(PatientContext);
	if (context === undefined) {
		throw new Error("usePatientContext must be use within a PatienProvider");
	}
	return context;
};

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
	addPatient: (patient: Patient) => void;
	editPatient: (index: number, newPatient: Patient) => void;
	deletePatient: (index: number) => void;
	setSearchPatient: (search: string) => void;
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
		setPatients((prevPatients) => [...prevPatients, patient]);
	};

	const editPatient = (index: number, newPatient: Patient) => {
		setPatients((prevPatients) => [
			...prevPatients.slice(0, index),
			newPatient,
			...prevPatients.slice(index + 1),
		]);
	};

	const deletePatient = (index: number) => {
		setPatients((prevPatients) => [
			...prevPatients.slice(0, index),
			...prevPatients.slice(index + 1),
		]);
	};

	return (
		<PatientContext.Provider
			value={{
				patients,
				filteredPatients,
				searchPatient,
				addPatient,
				editPatient,
				deletePatient,
				setSearchPatient,
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

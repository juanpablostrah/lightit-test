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

	const timeAwaitToSearch: number = 2000;

	useEffect(() => {
		fetch("https://63bedcf7f5cfc0949b634fc8.mockapi.io/users")
			.then((response) => response.json())
			.then((data) => setPatients(data))
			.catch((error) => console.error("Error fetching patients:", error));
	}, []);

	useEffect(() => {
		setFilteredPatients(
			patients.filter((patient) =>
				patient.name.toLowerCase().includes(searchPatient.toLowerCase())
			)
		);
	}, [searchPatient, patients]);

	const handleAddPatient = (patient: Patient) => {
		setPatients((prevPatients) => [...prevPatients, patient]);
	};

	const handleEditPatient = (index: number, newPatient: Patient) => {
		setPatients((prevPatients) =>
			prevPatients.map((patient, i) => (i === index ? newPatient : patient))
		);
	};

	const handleDeletePatient = (index: number) => {
		setPatients((prevPatients) => prevPatients.filter((_, i) => i !== index));
	};

	return (
		<PatientContext.Provider
			value={{
				patients,
				filteredPatients,
				searchPatient,
				addPatient: handleAddPatient,
				editPatient: handleEditPatient,
				deletePatient: handleDeletePatient,
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

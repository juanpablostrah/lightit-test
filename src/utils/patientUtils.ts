import { Patient } from "../components/patient/patient-list/PatientList";

export const addPatient = (
	patients: Patient[],
	patient: Patient
): Patient[] => {
	return [...patients, patient];
};

export const editPatient = (
	patients: Patient[],
	index: number,
	newPatient: Patient
): Patient[] => {
	const updatedPatients = [...patients];
	updatedPatients[index] = newPatient;
	return updatedPatients;
};

export const deletePatient = (
	patients: Patient[],
	index: number
): Patient[] => {
	return [...patients.slice(0, index), ...patients.slice(index + 1)];
};

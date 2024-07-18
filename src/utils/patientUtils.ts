export const addPatient = (patients: string[], patient: string): string[] => {
	return [...patients, patient];
};

export const editPatient = (
	patients: string[],
	index: number,
	newPatient: string
): string[] => {
	const updatedPatients = [...patients];
	updatedPatients[index] = newPatient;
	return updatedPatients;
};

export const deletePatient = (patients: string[], index: number): string[] => {
	return [...patients.slice(0, index), ...patients.slice(index + 1)];
};

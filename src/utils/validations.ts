import { Patient } from "../PatientContext";

interface ValidationRules {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
}

interface ErrorMessages {
	required?: string;
	minLength?: string;
	maxLength?: string;
}

interface ValidationConfig {
	[key: string]: ValidationRules;
}

interface ErrorConfig {
	[key: string]: ErrorMessages;
}

const validationRules: ValidationConfig = {
	name: {
		required: true,
		minLength: 3,
		maxLength: 50,
	},
	description: {
		required: true,
		minLength: 10,
		maxLength: 1000,
	},
	avatar: {
		required: true,
	},
};

export const errorMessages: ErrorConfig = {
	name: {
		required: "Name is required",
		minLength: "Name must be at least 3 characters",
		maxLength: "Name must be less than 50 characters",
	},
	description: {
		required: "Description is required",
		minLength: "Description must be at least 10 characters",
		maxLength: "Description must be at maximun 1000 characters",
	},
	avatar: {
		required: "Patient photo is required",
	},
};

export const validateForm = (patient: Patient): { [key: string]: string } => {
	const errors: { [key: string]: string } = {};
	Object.keys(validationRules).forEach((field) => {
		const error = validateField(
			field,
			patient[field as keyof Patient] as string
		);
		if (error) {
			errors[field] = error;
		}
	});
	return errors;
};

export const validateField = (name: string, value: string): string => {
	const rules = validationRules[name];
	if (!rules) return "";

	if (rules.required && !value.trim()) {
		return errorMessages[name].required || `${name} is required`;
	}

	if (rules.minLength && value.length < rules.minLength) {
		return (
			errorMessages[name].minLength ||
			`${name} must be at least ${rules.minLength} characters`
		);
	}

	if (rules.maxLength && value.length > rules.maxLength) {
		return (
			errorMessages[name].maxLength ||
			`${name} must be less than ${rules.maxLength} characters`
		);
	}

	return "";
};

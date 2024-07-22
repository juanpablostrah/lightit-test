import { useEffect, useRef, useCallback } from "react";

const useTextareaAutoHeight = (value: string) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const adjustTextareaHeight = useCallback(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, []);

	useEffect(() => {
		adjustTextareaHeight();
	}, [value, adjustTextareaHeight]);

	return { textareaRef, adjustTextareaHeight };
};

export default useTextareaAutoHeight;

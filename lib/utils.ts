import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getTurkeyDate() {
	const now = new Date();
	const turkeyTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
	return turkeyTime;
}

export function getTurkeyDateString() {
	const date = getTurkeyDate();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function getTurkeyWeekStart() {
	const date = getTurkeyDate();
	const day = date.getDay(); // 0 is Sunday
	const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
	date.setDate(diff);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${d}`;
}

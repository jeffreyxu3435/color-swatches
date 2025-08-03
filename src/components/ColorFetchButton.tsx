"use client";

import { useState } from "react";

interface ColorFetchButtonProps {
	saturation: number;
	lightness: number;
	onDataReceived: (data: any) => void;
	onError: (error: string) => void;
}

export default function ColorFetchButton({
	saturation,
	lightness,
	onDataReceived,
	onError,
}: ColorFetchButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleApiCall = async () => {
		setIsLoading(true);
		onError("");
		try {
			const queryParams = new URLSearchParams({
				saturation: saturation.toString(),
				lightness: lightness.toString(),
			});
			const response = await fetch(`/api/colors?${queryParams.toString()}`);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to fetch colors");
			}

			const result = await response.json();
			onDataReceived(result.data);
		} catch (err) {
			onError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			onClick={handleApiCall}
			disabled={isLoading}
			className={`px-4 py-2 rounded-md font-medium transition-colors ${
				isLoading
					? "bg-gray-400 cursor-not-allowed"
					: "bg-blue-500 hover:bg-blue-600"
			} text-white`}
		>
			{isLoading ? "Loading..." : "Get Colors"}
		</button>
	);
}

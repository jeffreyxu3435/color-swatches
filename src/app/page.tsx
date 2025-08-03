"use client";

import { useState } from "react";
import ColorFetchButton from "@/components/ColorFetchButton";

export default function Home() {
	// TODO: typing
	const [data, setData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [saturation, setSaturation] = useState(50);
	const [lightness, setLightness] = useState(50);

	const handleDataReceived = (data: any) => {
		setData(data);
		setError(null);
	};

	const handleError = (error: string) => {
		setError(error);
		setData(null);
	};

	return (
		<div className="font-sans flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
			<main className="flex flex-col gap-8 items-center w-full max-w-6xl">
				<h1 className="text-4xl font-bold text-center">Color Swatches</h1>
				<div className="flex flex-col gap-6 w-full max-w-md">
					<div>
						<label
							htmlFor="saturation"
							className="block font-medium mb-1"
							style={{
								color: `hsl(217, ${saturation}%, 60%)`,
							}}
						>
							Saturation
						</label>
						<div className="flex items-center gap-2">
							<input
								id="saturation"
								type="range"
								min={0}
								max={100}
								value={saturation}
								onChange={(e) => setSaturation(Number(e.target.value))}
								className="flex-1 accent-white-500"
							/>
							<input
								type="number"
								min={0}
								max={100}
								value={saturation}
								onChange={(e) => {
									const val = Number(e.target.value);
									if (!isNaN(val) && val >= 0 && val <= 100) {
										setSaturation(val);
									}
								}}
								className="w-16 px-2 py-1 border rounded text-center"
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="lightness"
							className="block font-medium mb-1"
							style={{
								color: `hsl(217, 60%, ${lightness}%)`,
							}}
						>
							Lightness
						</label>
						<div className="flex items-center gap-2">
							<input
								id="lightness"
								type="range"
								min={0}
								max={100}
								value={lightness}
								onChange={(e) => setLightness(Number(e.target.value))}
								className="flex-1 accent-white-500"
							/>
							<input
								type="number"
								min={0}
								max={100}
								value={lightness}
								onChange={(e) => {
									const val = Number(e.target.value);
									if (!isNaN(val) && val >= 0 && val <= 100) {
										setLightness(val);
									}
								}}
								className="w-16 px-2 py-1 border rounded text-center"
							/>
						</div>
					</div>
				</div>
				<ColorFetchButton
					saturation={saturation}
					lightness={lightness}
					onDataReceived={handleDataReceived}
					onError={handleError}
				/>
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						<strong>Error:</strong> {error}
					</div>
				)}
				{/* TODO: If I had more time, componentize this */}
				{data && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded w-full max-w-5xl">
						<h3 className="font-bold mb-6 text-center text-lg">Color Scheme</h3>
						<div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
							{data.map((color: any, index: number) => (
								<div key={index} className="flex flex-col items-center">
									<div
										className="w-20 h-20 rounded-lg border-2 border-gray-300 shadow-md mb-3"
										style={{
											backgroundColor: color.hex.value,
										}}
									/>
									<div className="text-sm text-center">
										<div className="font-semibold mb-1">{color.name.value}</div>
										<div className="text-gray-600 text-xs">
											{color.rgb.value}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

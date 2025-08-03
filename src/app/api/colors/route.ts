import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache for color data
const colorCache = new Map<string, any>();

async function fetchColorWithCache(
	hue: number,
	saturation: string,
	lightness: string
) {
	const cacheKey = `${hue}-${saturation}-${lightness}`;

	if (colorCache.has(cacheKey)) {
		return colorCache.get(cacheKey);
	}

	const externalUrl = `https://www.thecolorapi.com/id?hsl=${hue},${saturation}%,${lightness}%`;

	try {
		const response = await fetch(externalUrl, {
			method: "GET",
			headers: {
				"User-Agent": "Color-Swatches-App/1.0",
			},
		});

		if (response.ok) {
			const data = await response.json();
			colorCache.set(cacheKey, data);
			return data;
		}
	} catch (error) {
		console.error(`Error fetching color for hue ${hue}:`, error);
	}

	return null;
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const saturation = searchParams.get("saturation") || "50";
		const lightness = searchParams.get("lightness") || "50";

		const allColors = [];
		const seenColorNames = new Set();
		let hue = 0;
		const step = 5;
		let isFinished = false;

		while (!isFinished) {
			// Final iteration
			if (hue > 360) {
				hue = 359;
				isFinished = true;
			}
			const data = await fetchColorWithCache(hue, saturation, lightness);

			if (data) {
				const colorName = data.name?.value || "unknown";

				if (!seenColorNames.has(colorName)) {
					seenColorNames.add(colorName);
					allColors.push(data);
					// For the case that there are potentially multiple
					// colors between this one and the previous step's
					let backHue = hue - 1;
					while (backHue >= hue - step) {
						const backData = await fetchColorWithCache(
							backHue,
							saturation,
							lightness
						);
						if (backData) {
							const backColorName = backData.name?.value || "unknown";

							if (!seenColorNames.has(backColorName)) {
								seenColorNames.add(backColorName);
								allColors.push(backData);
							}
						}
						backHue -= 1;
					}
				}
			}

			hue += step;
		}

		// Sort by hue for consistent ordering
		allColors.sort((a, b) => a.hsl.h - b.hsl.h);

		return NextResponse.json({
			success: true,
			data: allColors,
			params: { saturation, lightness, totalColors: allColors.length },
		});
	} catch (error) {
		console.error("Error fetching colors:", error);
		return NextResponse.json(
			{ error: "Failed to fetch colors" },
			{ status: 500 }
		);
	}
}

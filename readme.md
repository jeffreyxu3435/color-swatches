This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Project Notes

### Stack

I went with a Next.js web app (Next, React, Node): It's the stack I've been working in at Visia and has a simple bootstrapper with some powerful tools out of the box such as hot reloading, linting, and router logging. The project came bootstrapped with Tailwind which will help with responsive design as well.

### Design

I wanted a fairly simple layout with black and white which I felt would contrast well with the plethora of colors returned, and added a small flair where the saturation and lightness sliders affect the respective properties of the labels themselves. This serves as a visual indicator of what said sliders would impact as well, helping users not familiar with the color scheme understand how to use it. I also made sure to have both the slider and a text input method of input for greater granularity. The results are then displayed in order of hue. As the window width decreases (smaller browser size, mobile device), the number of elements in the grid decreases to accomodate.

### Minimizing API Calls

The key insight for getting named colors without having to query all 360 available hues for a given saturation and lightness pair comes in the fact that all repeat color names are consecutive. This means that for any 2 given hues + names, say 0 and red, and 10 and red, we can safely assume that every color in between is red, and we do not need to query the color API for any of those in between colors. Given this key insight, I wrote a function that would query the API in steps (I went with a step size of 5 as we don’t want it to be too large or too small) that works as follows: If the color name has been seen before, ignore all colors in between and query the next step (hue + 5). If that name has not been seen, add the name to the set of seen names + the color data to the dataset and check the colors in between for any other potential new colors. This step is crucial as we can have the case of one or many colors in between the two colors we check that could get skipped over. Finally, sort by hue as this method of backtracking would append a color of lower hue after the higher hue color, and return. This reduces the number of API calls by around 40-50% from the initial 360.
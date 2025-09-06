import { useState } from "react";
import { ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react';  
const features = [
	{
		title: "Enter Zen Mode",
		tagline: "Budget without the chaos.",
		description:
			"Clear away the clutter with a minimal, stress-free view that shows only your essentials — balance, budgets, and goals.",
		img: "/zenmode.png",
		bg_color: "#fffceb",
	},
	{
		title: "Power Up Goals",
		tagline: "Turn dreams into deadlines.",
		description:
			"Set savings goals and watch your progress grow with every rupee saved. From gadgets to getaways, see how close you are in real time.",
		img: "/goals.png",
		bg_color: "#fffceb",
	},
	{
		title: "Smart Spend Radar",
		tagline: "Spot leaks before they sink you.",
		description:
			"Get instant insights on unusual spending patterns and friendly nudges to stay on track — because small leaks sink big ships.",
		img: "/radar.png",
		bg_color: "#fffceb",
	},
];

export default function FeatureSlider() {
	const [index, setIndex] = useState(0);

	const prev = () => setIndex((index - 1 + features.length) % features.length);
	const next = () => setIndex((index + 1) % features.length);

	return (
		<div className="w-full max-w-4xl mx-auto flex items-center justify-center relative">
			<div className="w-full bg-white rounded-2xl shadow-lg flex overflow-hidden">
				{/* Left: Image */}
				<div
					className="w-1/2 flex items-center justify-center p-6"
					style={{ backgroundColor: features[index].bg_color }}
				>
					<img
						src={features[index].img}
						alt={features[index].title}
						className="h-64 object-contain"
					/>
				</div>

				{/* Right: Text */}
				<div className="w-1/2 p-8 flex flex-col justify-center">
					<h2 className="text-2xl font-bold">{features[index].title}</h2>
					<p className="text-purple-600 font-semibold mt-2">
						{features[index].tagline}
					</p>
					<p className="text-gray-800 mt-4">
						{features[index].description}
					</p>
				</div>
			</div>

			{/* Navigation */}
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4">
				<button
					onClick={prev}
					className="px-4 py-2 bg-purple-200 rounded-full hover:bg-purple-300"
				>
        <ArrowBigLeftDash/>
				</button>
				<button
					onClick={next}
					className="px-4 py-2 bg-purple-200 rounded-full hover:bg-purple-300"
          >
        <ArrowBigRightDash/>
				</button>
			</div>
		</div>
	);
}

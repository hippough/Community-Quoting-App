"use client";

import { Container, Section } from "@/components/misc/craft";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileText, FolderPlus, Quote, Search } from "lucide-react";

const steps = [
	{
		icon: FolderPlus,
		title: "Create a Text",
		description:
			"Create a new text container where you'll store your document.",
	},
	{
		icon: FileText,
		title: "Upload Your Text",
		description:
			"Import your document as a PDF or paste text directly.",
	},
	{
		icon: Search,
		title: "Smart Search",
		description:
			"Quickly find relevant quotes based on keywords.",
	},
	{
		icon: Quote,
		title: "Select Quotes",
		description: "Choose and copy the most impactful quotes for your analysis.",
	},
];

const Step = ({ step, index }: { step: (typeof steps)[0]; index: number }) => {
	const Icon = step.icon;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
			className="relative"
		>
			{index < steps.length - 1 && (
				<div className="hidden lg:block absolute top-10 left-[50%] w-[255px] h-[2px] bg-border" />
			)}

			<div className="relative flex flex-col items-center text-center">
				<motion.div
					whileHover={{ scale: 1.1, rotate: 5 }}
					className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative"
				>
					<Icon className="size-8 text-primary" />
					<div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
						{index + 1}
					</div>
				</motion.div>

				<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
				<p className="text-muted-foreground max-w-xs">{step.description}</p>
			</div>
		</motion.div>
	);
};

export default function HowItWorks() {
	return (
		<Section id="how-it-works" className="scroll-mt-16">
			<Container>
				<div className="space-y-4 text-center mb-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold sm:text-4xl mb-4">
							How It Works
						</h2>
						<p
							className={cn(
								"text-lg text-muted-foreground max-w-2xl mx-auto",
								"leading-relaxed"
							)}
						>
							Get started with Quoter in four simple steps
						</p>
					</motion.div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{steps.map((step, index) => (
						<Step key={step.title} step={step} index={index} />
					))}
				</div>
			</Container>
		</Section>
	);
}

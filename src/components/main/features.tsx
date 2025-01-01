"use client";

import { Container, Section } from "@/components/misc/craft";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, Search, Upload } from "lucide-react";

const features = [
	{
		icon: BookOpen,
		title: "Text Library",
		description: "Store and organize your texts for easy access",
	},
	{
		icon: Upload,
		title: "Easy Upload",
		description: "Drag and drop PDFs or paste text directly.",
	},
	{
		icon: Search,
		title: "Smart Search",
		description: "Quickly find relevant quotes using keywords and themes",
	},
];

const FeatureCard = ({
	feature,
	index,
}: {
	feature: (typeof features)[0];
	index: number;
}) => {
	const Icon = feature.icon;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
		>
			<Card className="relative">
				<CardHeader className="space-y-1">
					<div className="flex items-center gap-4">
						<motion.div
							className="rounded-lg bg-primary/10 p-2"
							whileHover={{ rotate: 5 }}
						>
							<Icon className="h-6 w-6 text-primary" />
						</motion.div>
						<CardTitle className="text-lg font-semibold">
							{feature.title}
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<CardDescription className="text-base">
						{feature.description}
					</CardDescription>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default function Features() {
	return (
		<Section className="bg-secondary scroll-mt-16" id="features">
			<Container>
				<div className="space-y-4 text-center mb-12">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl font-bold sm:text-4xl mb-4">
							Everything You Need
						</h2>
						<p
							className={cn(
								"text-lg text-muted-foreground max-w-2xl mx-auto",
								"leading-relaxed"
							)}
						>
							Intuitive features to help you find and analyze quotes conveniently
						</p>
					</motion.div>
				</div>

				<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
					{features.map((feature, index) => (
						<FeatureCard key={feature.title} feature={feature} index={index} />
					))}
				</div>
			</Container>
		</Section>
	);
}

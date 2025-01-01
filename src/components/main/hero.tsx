"use client";

import { Container, Section } from "@/components/misc/craft";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

const HeroIllustration = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 500 400"
		className="w-full h-full"
	>
		<defs>
			<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop
					offset="0%"
					style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.2 }}
				/>
				<stop
					offset="100%"
					style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.1 }}
				/>
			</linearGradient>
			<linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop
					offset="0%"
					style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.9 }}
				/>
				<stop
					offset="100%"
					style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.7 }}
				/>
			</linearGradient>
		</defs>

		{/* Main Book */}
		<rect
			x="150"
			y="100"
			width="200"
			height="250"
			rx="10"
			className="fill-primary"
			opacity="0.9"
		/>
		<rect
			x="160"
			y="110"
			width="180"
			height="230"
			rx="8"
			fill="hsl(var(--background))"
		/>

		{/* Text Lines */}
		<g className="fill-primary" opacity="0.3">
			<rect x="180" y="140" width="140" height="4" rx="2" />
			<rect x="180" y="160" width="120" height="4" rx="2" />
			<rect x="180" y="180" width="130" height="4" rx="2" />
			<rect x="180" y="200" width="110" height="4" rx="2" />
			<rect x="180" y="220" width="140" height="4" rx="2" />
		</g>

		{/* Floating Elements */}
		<circle cx="100" cy="150" r="20" className="fill-primary" opacity="0.2">
			<animate
				attributeName="cy"
				values="150;130;150"
				dur="4s"
				repeatCount="indefinite"
			/>
		</circle>
		<circle cx="400" cy="250" r="15" className="fill-primary" opacity="0.2">
			<animate
				attributeName="cy"
				values="250;270;250"
				dur="3s"
				repeatCount="indefinite"
			/>
		</circle>
		<circle cx="380" cy="100" r="10" className="fill-primary" opacity="0.2">
			<animate
				attributeName="cy"
				values="100;80;100"
				dur="5s"
				repeatCount="indefinite"
			/>
		</circle>

		{/* Magnifying Glass */}
		<g>
			{/* Handle */}
			<line
				x1="280"
				y1="170"
				x2="300"
				y2="190"
				stroke="url(#glassGrad)"
				strokeWidth="6"
				strokeLinecap="round"
			>
				<animateTransform
					attributeName="transform"
					type="translate"
					values="0,0; -80,0; 0,0"
					dur="4s"
					repeatCount="indefinite"
				/>
			</line>

			{/* Glass Circle */}
			<circle
				cx="270"
				cy="160"
				r="15"
				stroke="url(#glassGrad)"
				strokeWidth="4"
				fill="none"
			>
				<animateTransform
					attributeName="transform"
					type="translate"
					values="0,0; -80,0; 0,0"
					dur="4s"
					repeatCount="indefinite"
				/>
			</circle>

			{/* Highlight Effect */}
			<rect
				x="180"
				y="160"
				width="120"
				height="4"
				rx="2"
				className="fill-primary"
				opacity="0"
			>
				<animate
					attributeName="opacity"
					values="0;0.6;0"
					dur="4s"
					repeatCount="indefinite"
				/>
			</rect>
		</g>
	</svg>
);

export default function Hero() {
	return (
		<Section className="min-h-screen flex items-center bg-background">
			<Container>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
					{/* Text Content */}
					<motion.div
						className="text-center lg:text-left"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
							<Balancer>Quickly Find Quotes for Your Analysis</Balancer>
						</h1>
						<p className="leading-7 [&:not(:first-child)]:mt-6">
							<Balancer>
								Streamline your literary analysis with our quote
								search tool. Perfect for students and teachers working on
								rhetorical analysis and essay writing.
							</Balancer>
						</p>

						<div className="mt-10 flex items-center gap-x-6 justify-center lg:justify-start">
							<Link href="/login">
								<Button className="gap-2">
									<GraduationCap className="w-5 h-5" />
									Get Started
								</Button>
							</Link>

							<Link href="#features">
								<Button variant="outline" className="gap-2">
									Learn More
									<ArrowRight className="w-5 h-5" />
								</Button>
							</Link>
						</div>
					</motion.div>

					{/* SVG Illustration */}
					<motion.div
						className="w-full max-w-[300px] lg:max-w-none max-w-xl mx-auto"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<div className="w-full aspect-[5/4]">
							<HeroIllustration />
						</div>
					</motion.div>
				</div>
			</Container>
		</Section>
	);
}

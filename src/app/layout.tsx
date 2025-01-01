import { Layout } from "@/components/misc/craft";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Quoter - Quick Quote Search",
		template: "%s | Quoter",
	},
	description:
		"Making literary analysis easier and more efficient for students and teachers with quick quote search.",
	metadataBase: new URL("https://quoting-app-puce.vercel.app"),
	keywords: [
		"quote search",
		"literary analysis",
		"text analysis",
		"student tools",
		"teaching tools",
		"education software",
	],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://quoting-app-puce.vercel.app",
		title: "Quoter - Quick Quote Search for Literary Analysis",
		description:
			"Making literary analysis easier and more efficient for students and teachers with quick quote search.",
		siteName: "Quoter",
		images: [
			{
				url: "https://quoting-app-puce.vercel.app/landscape.png",
				width: 1200,
				height: 630,
				alt: "Quoter - Quick Quote Search",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Quoter - Smart Quote Search for Literary Analysis",
		description:
			"Making literary analysis easier and more efficient for students and teachers with quick quote search.",
		images: ["https://quoting-app-puce.vercel.app/landscape.png"],
	},
	applicationName: "Quoter",
	generator: "Next.js",
	referrer: "origin-when-cross-origin",
	robots: {
		index: true,
		follow: true,
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: "Quoter",
	description:
		"Making literary analysis easier and more efficient for students and teachers with quick quote search.",
	url: "https://quoting-app-puce.vercel.app",
	applicationCategory: "EducationalApplication",
	operatingSystem: "Any",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "USD",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Layout>
			<Script
				id="json-ld"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster />
					<SpeedInsights />
					<Analytics />
				</ThemeProvider>
			</body>
		</Layout>
	);
}

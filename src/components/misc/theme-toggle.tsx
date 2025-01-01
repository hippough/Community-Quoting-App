"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className="relative"
		>
			{/* Sun icon */}
			<motion.div
				initial={{ scale: 0, rotate: 90 }}
				animate={{
					scale: theme === "light" ? 1 : 0,
					rotate: theme === "light" ? 0 : 90,
				}}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="absolute"
			>
				<Sun className="h-5 w-5" />
			</motion.div>

			{/* Moon icon */}
			<motion.div
				initial={{ scale: 0, rotate: -90 }}
				animate={{
					scale: theme === "dark" ? 1 : 0,
					rotate: theme === "dark" ? 0 : -90,
				}}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="absolute"
			>
				<Moon className="h-5 w-5" />
			</motion.div>

			{/* Hidden text for accessibility */}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/misc/theme-toggle";

const links: { title: string; href: string }[] = [
	{ title: "Features", href: "#features" },
	{ title: "How It Works", href: "#how-it-works" },
	{ title: "Log In", href: "/login" },
];

export default function Navbar() {
	return (
		<nav className="fixed z-50 transition-all duration-500 bg-background py-4 top-0 left-0 right-0 border-b px-4">
			<div className="flex items-center justify-between">
				<Link href="/" className="text-2xl font-bold">
					Quoter
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-4">
					{links.map((link, index) => (
						<Link key={index} href={link.href}>
							<Button
								variant={index === links.length - 1 ? "default" : "ghost"}
							>
								{link.title}
							</Button>
						</Link>
					))}
					<ThemeToggle />
				</div>

				{/* Mobile Navigation */}
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="md:hidden z-10">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader className="mb-4 items-start">
							<Link href="/">
								<SheetTitle className="text-2xl">Quoter</SheetTitle>
							</Link>
						</SheetHeader>

						<div className="flex flex-col gap-4">
							{links.map((link, index) => (
								<Link
									key={index}
									href={link.href}
									className={
										index === links.length - 1
											? "text-lg font-medium text-primary"
											: "text-lg font-medium"
									}
								>
									{link.title}
								</Link>
							))}
							<ThemeToggle />
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}

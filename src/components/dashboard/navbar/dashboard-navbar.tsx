"use client";

import { getTextTitle } from "@/app/actions/actions";
import ThemeToggle from "@/components/misc/theme-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { User } from "@supabase/auth-js/dist/module/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CreateTextButton from "./create-text";
import UserMenu from "./user-menu";

export default function DashboardNavbar({ user }: { user: User }) {
	const pathname = usePathname();
	const [title, setTitle] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function fetchText() {
			try {
				setIsLoading(true);
				setTitle("");

				const pathParts = pathname.split("/");
				const textId = pathParts[pathParts.length - 1];

				if (!textId || pathname === "/dashboard") return;

				const data = await getTextTitle({ textId });
				if (data.success) {
					setTitle(data.data);
				} else {
					console.error("Failed to fetch text title");
				}
			} catch (error) {
				console.error("Error fetching text title:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchText();

		return () => {
			setTitle("");
		};
	}, [pathname]);

	return (
		<nav className="fixed top-0 w-full z-50 border-b bg-background">
			<div className="flex h-16 items-center px-4">
				<div className="flex items-center">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link
										href="/dashboard"
										className="text-2xl font-bold no-underline text-primary"
									>
										Quoter
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>

							{title && (
								<>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										<BreadcrumbLink>
											{isLoading ? "Loading..." : title}
										</BreadcrumbLink>
									</BreadcrumbItem>
								</>
							)}
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<div className="ml-auto flex items-center space-x-4">
					<CreateTextButton />
					<UserMenu user={user} />
					<ThemeToggle />
				</div>
			</div>
		</nav>
	);
}

import CreateTextButton from "@/components/dashboard/add-text";
import { Container, Section } from "@/components/misc/craft";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Bird, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { createClient } from "../../../utils/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/login");
	}

	const texts = await prisma.text.findMany({
		where: {
			userId: data.user.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<main>
			<Section>
				<Container>
					{texts.length === 0 ? (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									No Texts Yet
									<Bird className="h-6 w-6 ml-2" />
								</CardTitle>
								<CardDescription>
									Get started by adding your first text for analysis.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<CreateTextButton />
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{texts.map((text) => (
								<Link key={text.id} href={`/dashboard/text/${text.id}`}>
									<Card className="hover:bg-accent/50 hover:border-primary/15 transition-colors group">
										<CardHeader>
											<CardTitle className="line-clamp-1 flex items-center">
												{text.title}
												<ChevronRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary group-hover:scale-110 transition-all" />
											</CardTitle>
											<CardDescription>
												{new Date(text.createdAt).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</CardDescription>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground line-clamp-1">
												{text.content || "No content"}
											</p>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					)}
				</Container>
			</Section>
		</main>
	);
}

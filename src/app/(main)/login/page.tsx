import LoginButton from "@/components/main/login/login-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
	description:
		"Log in to Quoter to access your quotes and text analysis tools.",
};

export default async function LoginPage() {
	const supabase = await createClient();

	const { data } = await supabase.auth.getUser();
	if (data.user) {
		redirect("/dashboard");
	}
	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-[400px]">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Continue with Google to log in or sign up.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoginButton />
				</CardContent>
			</Card>
		</main>
	);
}

import DashboardNavbar from "@/components/dashboard/navbar/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/login");
	}

	return (
		<>
			<DashboardNavbar user={data.user} />
			{children}
		</>
	);
}

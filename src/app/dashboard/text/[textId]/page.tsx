import { notFound, redirect } from "next/navigation";
import prisma from "../../../../../lib/prisma";
import { createClient } from "../../../../../utils/supabase/server";
import TextDisplay from "@/components/text/text-display";
import QuoteSearch from "@/components/text/quote-search";

export default async function TextPage({
	params,
}: {
	params: Promise<{ textId: string }>;
}) {
    const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/login");
	}
    
    const { textId } = await params;
    const text = await prisma.text.findFirst({
        where: {
            id: textId,
            userId: data.user.id,
        }
    })

    if(!text){
        notFound();
    }

	return (
		<main className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-screen">
			<TextDisplay text={text} />
			<QuoteSearch text={text} />
		</main>
	);
}

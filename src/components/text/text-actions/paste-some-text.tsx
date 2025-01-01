"use client";

import { editText } from "@/app/actions/actions";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"; // Adjust import path based on your setup
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	text: z.string().min(1, { message: "Text is required." }).trim(),
});

export default function PasteText({
	text,
	isOpen,
	setIsOpen,
}: {
	text: Text;
    isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			text: `${text.content}`,
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			const res = await editText({ textId: text.id, content: data.text });
			if (res.error) {
				toast.error(res.error);
				return;
			}

			toast.success("Text updated successfully!");
			router.refresh();
			setIsOpen(false);
		} catch (error) {
			console.error("Error updating text: ", error);
			toast.error("Failed to update text. Please try again.");
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Paste Text</DialogTitle>
					<DialogDescription>
						Copy and paste your text to find quotes.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="text"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Text</FormLabel>
									<FormControl>
										<AutosizeTextarea
											placeholder="Paste text here..."
											maxHeight={200}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

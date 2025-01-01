"use client";

import { createText } from "@/app/actions/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const createTextSchema = z.object({
	title: z
		.string()
		.min(1, {
			message: "Title is required",
		})
		.max(100, {
			message: "Title must not exceed 100 characters",
		}),
});

export default function CreateTextButton() {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof createTextSchema>>({
		resolver: zodResolver(createTextSchema),
		defaultValues: {
			title: "",
		},
	});

	async function onSubmit(data: z.infer<typeof createTextSchema>) {
		try {
			const res = await createText({
				title: data.title,
				content: "",
			});
			if (res.error) {
				toast.error(res.error);
				return;
			}

			toast.success("Text created successfully!");
			router.refresh();
			setOpen(false);
			form.reset();
		} catch (error) {
			console.log("Error creating text: ", error);
			toast.error("Failed to create text. Please try again.");
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" className="gap-2">
					<Plus className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Text</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Enter text title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? "Creating..." : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

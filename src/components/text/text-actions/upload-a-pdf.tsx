"use client";

import { editText } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import pdfToText from "react-pdftotext";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	pdf: z
		.array(z.instanceof(File))
		.refine(
			(files: File[]) => files.length === 1,
			"Only one file can be uploaded."
		)
		.refine(
			(files: File[]) => files[0]?.type === "application/pdf",
			"Only PDF files are allowed."
		),
});

export default function UploadAPDF({
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
			pdf: [],
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const file = values.pdf[0];
		if (!file) {
			toast.error("No file uploaded.");
			return;
		}
		try {
            const content = await pdfToText(file);

			const res = await editText({
				textId: text.id,
				content: content,
			});
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
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Upload PDF</DialogTitle>
					<DialogDescription>
						Upload a PDF document to find quotes. Make sure the file contains
						the correct information before proceeding.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="pdf"
							render={({ field }) => (
								<FormItem>
									<FormLabel>PDF File</FormLabel>
									<FormControl>
										<FileUpload
											{...field}
											onChange={(files: File[]) => {
												form.setValue("pdf", files);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? "Uploading..." : "Upload"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

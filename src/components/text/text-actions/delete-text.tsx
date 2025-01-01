"use client";

import { deleteText } from "@/app/actions/actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Text } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteText({
	text,
	isOpen,
	setIsOpen,
}: {
	text: Text;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const router = useRouter();

	async function delText() {
		try {
			const res = await deleteText({ textId: text.id });
			if (res.error) {
				toast.error(res.error);
				return;
			}

			toast.success("Text deleted successfully!");
			router.push(`/dashboard`);
			setIsOpen(false);
		} catch (error) {
			console.error("Error deleting text: ", error);
			toast.error("Failed to delete text. Please try again.");
		}
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete your text and notes.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button
							className={buttonVariants({ variant: "destructive" })}
							onClick={() => delText()}
						>
							Delete
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

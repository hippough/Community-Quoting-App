"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Text } from "@prisma/client";
import { FilePenLine, Settings2, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import DeleteText from "./text-actions/delete-text";
import PasteText from "./text-actions/paste-some-text";
import UploadAPDF from "./text-actions/upload-a-pdf";

export default function TextDisplay({ text }: { text: Text }) {
	const [isUploadOpen, setIsUploadOpen] = useState(false);
	const [isPasteOpen, setIsPasteOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	return (
		<>
			<UploadAPDF
				text={text}
				isOpen={isUploadOpen}
				setIsOpen={setIsUploadOpen}
			/>
			<PasteText text={text} isOpen={isPasteOpen} setIsOpen={setIsPasteOpen} />
			<DeleteText
				text={text}
				isOpen={isDeleteOpen}
				setIsOpen={setIsDeleteOpen}
			/>

			<Card className="mt-16">
				<CardHeader>
					<CardTitle className="flex flex-row items-center justify-between">
						{text.title}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<Settings2 />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>Edit Text</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => setIsPasteOpen(true)}>
									<FilePenLine className="w-3 h-3" />
									Paste Text
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setIsUploadOpen(true)}>
									<Upload className="w-3 h-3" />
									Upload Pdf
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive"
									onClick={() => {
										setIsDeleteOpen(true);
									}}
								>
									<Trash2 className="w-3 h-3" />
									Delete Text
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</CardTitle>
					<CardDescription>
						Edited{" "}
						{new Date(text.updatedAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{text == null || text.content.trim() === "" ? (
						<div className="flex items-center justify-center p-6">
							<Alert className="max-w-md mx-auto">
								<AlertTitle>No Text Added</AlertTitle>
								<AlertDescription className="text-sm">
									It appears you haven{"'"}t added any text. Please{" "}
									<Button
										variant="link"
										className="p-0 h-5 font-bold"
										onClick={() => {
											setIsUploadOpen(true);
										}}
									>
										upload a PDF
									</Button>{" "}
									or{" "}
									<Button
										variant="link"
										className="p-0 h-5 font-bold"
										onClick={() => {
											setIsPasteOpen(true);
										}}
									>
										paste some text
									</Button>{" "}
									to display it here.
								</AlertDescription>
							</Alert>
						</div>
					) : (
						<ScrollArea className="h-[calc(100vh-240px)] w-full" type="scroll">
							<p>{text.content}</p>
						</ScrollArea>
					)}
				</CardContent>
			</Card>
		</>
	);
}

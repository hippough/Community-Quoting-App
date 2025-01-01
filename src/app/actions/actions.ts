"use server"

import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { createClient } from "../../../utils/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";


export async function signOut() {
	const supabase = await createClient();

	await supabase.auth.signOut();
}

const createTextSchema = z.object({
	title: z
		.string()
		.min(1, { message: "Title is required" })
		.max(100, { message: "Title must not exceed 100 characters" }),
	content: z
		.string()
		.max(50000, { message: "Content must not exceed 50,000 characters" }),
});

export async function createText({
	title,
	content,
}: {
	title: string;
	content: string;
}) {
    const supabase = await createClient();
    
	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/login");
	}

	try {
		// Validate the input
		const validated = createTextSchema.safeParse({ title, content });
		if (!validated.success) {
			return { error: "Invalid input" };
		}

		// Create text using Prisma
		const newText = await prisma.text.create({
			data: {
				title: validated.data.title,
				content: validated.data.content,
				userId: data.user.id,
			},
		});

		revalidatePath(`/dashboard`);
		return { success: true, data: newText };
	} catch (error) {
		console.error("Error creating text:", error);
		return { error: "Failed to create text" };
	}
}

const editTextSchema = z.object({
	content: z
		.string()
		.max(10000000, { message: "Content must not exceed 10000000 characters" }),
});

export async function editText({
	textId,
	content,
}: {
	textId: string;
	content: string;
}) {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/login");
	}

	try {
		// Validate the input
		const validated = editTextSchema.safeParse({ content });
		if (!validated.success) {
			return { error: "Invalid input" };
		}

		// Verify ownership
		const existingText = await prisma.text.findFirst({
			where: {
				id: textId,
				userId: data.user.id,
			},
		});

		if (!existingText) {
			return { error: "Text not found or unauthorized" };
		}

		// Update the text
		const updatedText = await prisma.text.update({
			where: {
				id: textId,
			},
			data: {
				content: validated.data.content,
				updatedAt: new Date(),
			},
		});

		revalidatePath(`/dashboard/text/${textId}`);
		return { success: true, data: updatedText };
	} catch (error) {
		console.error("Error editing text:", error);
		return { error: "Failed to edit text" };
	}
}

export async function deleteText({
	textId,
}: {
	textId: string;
}) {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/login");
	}

	try {
		// Verify ownership
		const existingText = await prisma.text.findFirst({
			where: {
				id: textId,
				userId: data.user.id,
			},
		});

		if (!existingText) {
			return { error: "Text not found or unauthorized" };
		}

		// Delete the text
		await prisma.text.delete({
			where: {
				id: textId,
			},
		});

		revalidatePath(`/dashboard/text/${textId}`);
		return { success: true };
	} catch (error) {
		console.error("Error deleting text:", error);
		return { error: "Failed to delete text" };
	}
}

export async function getTextTitle({textId}: {textId: string}){
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error || !data?.user) {
		redirect("/login");
	}

	try {
		// Verify ownership
		const existingText = await prisma.text.findFirst({
			where: {
				id: textId,
				userId: data.user.id,
			},
		});

		if (!existingText) {
			return { error: "Text not found or unauthorized" };
		}

		const title = existingText.title;

		revalidatePath(`/dashboard/text/${textId}`);
		return { success: true, data: title };
	} catch (error) {
		console.error("Error deleting text:", error);
		return { error: "Failed to delete text" };
	}
}
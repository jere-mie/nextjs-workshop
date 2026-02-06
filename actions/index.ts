"use server";

import { db } from "@/db";
import { ratings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addRating(formData: FormData) {
    const name = formData.get("name") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;

    await db.insert(ratings).values({
        name,
        rating,
        comment,
    });

    revalidatePath("/");
}

export async function deleteRating(id: number) {
    await db.delete(ratings).where(eq(ratings.id, id));
    revalidatePath("/");
}
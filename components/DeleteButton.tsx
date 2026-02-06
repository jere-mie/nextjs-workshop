"use client";

import { deleteRating } from "@/actions";

export default function DeleteButton({ id }: { id: number }) {
    return (
        <button onClick={() => deleteRating(id)}>Delete</button>
    );
}
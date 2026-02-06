"use client";

import { addRating } from "@/actions";

export default function RatingForm() {
    return (
        <form action={addRating}>
            <h2>Rate a Meal</h2>
            <div>
                <label>Meal Name</label>
                <input name="name" placeholder="Spicy Tofu" required />
            </div>
            <div>
                <label>Rating</label>
                <select name="rating">
                    {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>
                            {num} Stars
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Comments</label>
                <textarea name="comment" placeholder="It was great..." />
            </div>
            <button type="submit">Submit Rating</button>
        </form>
    );
}
import { db } from "@/db";
import { ratings } from "@/db/schema";
import { desc } from "drizzle-orm";
import RatingForm from "@/components/RatingForm";
import DeleteButton from "@/components/DeleteButton";

export default async function Home() {
    const allRatings = await db.select().from(ratings).orderBy(desc(ratings.id));

    return (
        <main>
            <h1>Campus Cravings 🍔</h1>
            <RatingForm />
            <div>
                <h2>Recent Reviews</h2>

                {allRatings.length === 0 && <p>No ratings yet. Be the first!</p>}

                {allRatings.map((rating) => (
                    <div key={rating.id}>
                        <h3>{rating.name}</h3>
                        <div>{rating.rating}/5</div>
                        <p>{rating.comment}</p>
                        <DeleteButton id={rating.id} />
                    </div>
                ))}
            </div>
        </main>
    );
}
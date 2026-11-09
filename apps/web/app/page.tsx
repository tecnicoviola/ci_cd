import { db, connectDb } from "@repo/db";

export default async function Home() {
  await connectDb();

  const user = await db.orm!.public!.User!
    .where({ email: "test@example.com" })
    .first();

  return (
    <main>
      <h1>Database Connection Test</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}
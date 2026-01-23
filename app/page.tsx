import Image from "next/image";
import { neon } from '@neondatabase/serverless';
import { Button } from "@shadcn/button";

export default function Page() {
  async function create(formData: FormData) {
    'use server';
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get('comment');
    // Insert the comment from the form into the Postgres database
    await sql`INSERT INTO products (name, price) VALUES (${comment}, 100)`;
  }

  return (
    <form action={create}>
      <Image src="/defaultPreview.png" alt="text" width={100} height={100} />
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
      <Button>Click me</Button>
    </form>
  );
}
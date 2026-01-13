import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// READ
export async function GET() {
  const client = await clientPromise;
  const db = client.db("todoApp");

  const todos = await db.collection("todos").find().toArray();
  return Response.json(todos);
}

// CREATE
export async function POST(req) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("todoApp");

  const result = await db.collection("todos").insertOne(body);
  return Response.json({ _id: result.insertedId, ...body });
}

// UPDATE
export async function PUT(req) {
  const { id, text, slug } = await req.json();
  const client = await clientPromise;
  const db = client.db("todoApp");

  await db.collection("todos").updateOne(
    { _id: new ObjectId(id) },
    { $set: { text, slug } }
  );

  return Response.json({ success: true });
}

// DELETE
export async function DELETE(req) {
  const { id } = await req.json();
  const client = await clientPromise;
  const db = client.db("todoApp");

  await db.collection("todos").deleteOne({ _id: new ObjectId(id) });
  return Response.json({ success: true });
}

import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  const notesData = await prisma.notes.findMany();

  return new Response(JSON.stringify(notesData));
}

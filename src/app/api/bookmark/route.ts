import prisma from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  const data = await prisma.bookmark.create({
    data: {
      noteId: body.noteId,
      userId: body.userId,
    },
  });

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}

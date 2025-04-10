import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  const notesData = await prisma.notes.findMany();

  return new Response(JSON.stringify(notesData));
}

export async function PUT(request: Request) {
  const body = await request.json();
  await prisma.notes.update({
    where: {
      id: body.noteId,
      userId: body.userId,
    },
    data: {
      likeCount: {
        increment: 1,
      },
    },
  });
  return new Response(JSON.stringify("liked"), {
    status: 200,
  });
}

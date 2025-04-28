import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  const notesData = await prisma.notes.findMany();
  return new Response(JSON.stringify(notesData));
}

export async function PUT(request: Request) {
  const body = await request.json();

  try {
    // Only filter by noteId - we want to update the note regardless of who created it
    const updatedNote = await prisma.notes.update({
      where: {
        id: body.noteId,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    await prisma.like.create({
      data: {
        notesId: body.noteId,
        userId: body.userId,
      },
    });

    return new Response(JSON.stringify(updatedNote), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return new Response(JSON.stringify({ error: "Failed to update note" }), {
      status: 500,
    });
  }
}

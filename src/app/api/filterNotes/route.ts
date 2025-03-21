import prisma from "../../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { search } = body;

  const data = await prisma.notes.findMany({
    where: {
      title: {
        contains: search,
        mode: "insensitive",
      },
    },
  });
  console.log(data);
  return new Response(JSON.stringify(data), {
    status: 200,
  });
}

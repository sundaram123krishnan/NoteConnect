import prisma from "../../../../lib/prisma";

// export async function GET(request: Request) {
//   const likes = await prisma.notes.aggregate({
//     _sum: {
//       likeCount: true,
//     },
//   });
//   console.log(likes);
//   return new Response(JSON.stringify(`${likes._sum.likeCount}`), {
//     status: 200,
//   });
// }

export async function POST(request: Request) {
  const body = await request.json();

  const likes = await prisma.notes.findFirst({
    where: {
      id: body.noteId,
    },
  });

  return new Response(JSON.stringify(likes?.likeCount), {
    status: 200,
  });
}

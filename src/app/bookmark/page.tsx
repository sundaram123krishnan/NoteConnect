import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { Card, Flex, Badge, Button, Text } from "@/once-ui/components";

export default async function BookMarks() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: session?.user.id,
    },
    select: {
      noteId: true,
    },
  });

  const noteIds = bookmarks.map((b) => b.noteId);

  const notes = await prisma.notes.findMany({
    where: {
      id: { in: noteIds },
    },
  });

  return (
    <div>
      <h1 className="mb-4">BookMarks</h1>
      <Flex direction="column" gap="8" align="start" fillWidth>
        {notes.map((note) => (
          <Card
            key={note.id}
            radius="l-4"
            direction="column"
            gap="8"
            padding="12"
            fillHeight
            fillWidth
          >
            <Text variant="body-default-xl">{note.title}</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {note.college}
            </Text>
            <Flex gap="4">
              {note.categories.map((category, index) => (
                <Badge key={index}>{category}</Badge>
              ))}
            </Flex>
            <Flex direction="row" gap="4" align="center">
              <Button href={note.notesLink}>Download PDF</Button>
            </Flex>
          </Card>
        ))}
      </Flex>
    </div>
  );
}

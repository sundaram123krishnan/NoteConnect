import { Badge, Button, Card, Flex, Text } from "@/once-ui/components";
import prisma from "../../lib/prisma";

export async function AllNotes() {
  const notes = await prisma.notes.findMany();
  return (
    <Flex direction="column" gap="8" zIndex={-1}>
      {notes.map((note, index) => (
        <Card
          key={index}
          fillWidth
          radius="l-4"
          direction="column"
          gap="8"
          padding="12"
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
          <Button href={note.notesLink}>Download PDF</Button>
        </Card>
      ))}
    </Flex>
  );
}

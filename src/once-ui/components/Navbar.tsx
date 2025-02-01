import { Heading, Button, Fade, Row, Column } from "@/once-ui/components";
import Link from "next/link";

export default function Navbar() {
  return (
    <Column
      fillWidth
      paddingY="40"
      paddingX="s"
      horizontal="center"
      flex={1}
      zIndex={10}
    >
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Row position="fixed" top="0" fillWidth horizontal="center" zIndex={3}>
        <Row
          data-border="rounded"
          horizontal="space-between"
          maxWidth="l"
          paddingLeft="32"
          paddingY="20"
        >
          <Heading weight="strong" as="h2" wrap="balance" align="center">
            <Link href="/">NoteConnect</Link>
          </Heading>
          <Row gap="12" hide="s">
            <Button href="/login">Login</Button>
          </Row>
          <Row gap="16" show="s" horizontal="center" paddingRight="24">
            <Button href="/login">Login</Button>
          </Row>
        </Row>
      </Row>
    </Column>
  );
}

import { UserMenu, Flex, Button, Column } from "@/once-ui/components";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import LogoutButton from "./Logout";

export default async function UserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const image = session?.user.image;
  return (
    <UserMenu
      avatarProps={{
        src: image as string,
        empty: image !== undefined ? false : true,
      }}
      dropdown={
        <Column>
          <Flex direction="column" gap="4" padding="4" background="transparent">
            <LogoutButton />
            <Button href="/upload-notes">Upload Notes</Button>
            <Button href="/bookmark">Bookmarks</Button>
          </Flex>
        </Column>
      }
    />
  );
}

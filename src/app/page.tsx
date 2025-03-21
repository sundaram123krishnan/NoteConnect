import { Column, Heading } from "@/once-ui/components";
import { AllNotes } from "./AllNotes";
import SearchNotes from "./SearchNotes";

export default function Home() {
  return (
    <Column gap="8">
      <SearchNotes />
    </Column>
  );
}

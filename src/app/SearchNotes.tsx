"use client";
import {
  Badge,
  Button,
  Card,
  Column,
  Flex,
  Input,
  Text,
} from "@/once-ui/components";
import type React from "react";

import { useState } from "react";

const allNotes = [
  {
    id: "cm6yziett0000sb2xj0ap5n0d",
    title: "Physics Class 12",
    categories: ["Physics", "Class 12", "CET"],
    college:
      "Birla College of Arts Science & Commerce Birla College Road Kalyan Dist Thane 421 304 (Id: C-33703)",
    state: "Maharashtra",
    district: "Thane",
    userId: "d0DYGbsF6YBlOs6pxWfWd17bFHprW5HY",
    notesLink:
      "https://utfs.io/a/8wa3a6isks/d5qt2MxcELzaPlq9NCKUT2kvfxn5VK1X7DB49bmaWcNsjgMh",
  },
  {
    id: "cm6z2t4340000sb1de2pqbpps",
    title: "CNOS",
    categories: ["OS", "CSE"],
    college: "A.B.M. COLLEGE NAGPUR (Id: C-44544)",
    state: "Maharashtra",
    district: "Nagpur",
    userId: "d0DYGbsF6YBlOs6pxWfWd17bFHprW5HY",
    notesLink:
      "https://utfs.io/a/8wa3a6isks/d5qt2MxcELzaFTbyQnIGPN1AH0a4ElOKt39Vpzqy7gJLkmjf",
  },
  {
    id: "cm70kx6660000sb6xevxw4gt9",
    title: "Physiotheraphy",
    categories: ["Medical", "Physiotherapy"],
    college: "Dr. Ulhas Patil College of Physiotherapy, Jalgaon (Id: C-14044)",
    state: "Maharashtra",
    district: "Jalgaon",
    userId: "d0DYGbsF6YBlOs6pxWfWd17bFHprW5HY",
    notesLink:
      "https://utfs.io/a/8wa3a6isks/d5qt2MxcELzagmT0KRaY9dCyH8MghjQl32kbxvTiOA06WnfJ",
  },
  {
    id: "cm70lrv150000sbiw6kei3zxk",
    title: "Basics of Electronics",
    categories: ["Engineering", "EXTC"],
    college:
      "Bhavik Vidya Prasark Mandals Jai Bhavani College Near Vitva Octoo Naka Vitava Kalwa Dist Thane (Id: C-34011)",
    state: "Maharashtra",
    district: "Thane",
    userId: "d0DYGbsF6YBlOs6pxWfWd17bFHprW5HY",
    notesLink:
      "https://utfs.io/a/8wa3a6isks/d5qt2MxcELzaX5GYNLuID17HolZY4uBcpzJ8TrFKa0qtkhAb",
  },
];

export default function SearchNotes() {
  const [data, setData] = useState(allNotes);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchValue = event.target.value;
    setSearch(newSearchValue);

    if (!newSearchValue || newSearchValue.trim().length <= 1) {
      setData(allNotes);
      return;
    }

    const timeoutId = setTimeout(() => {
      FilterNotes(newSearchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }

  async function FilterNotes(searchValue: string) {
    if (!searchValue || searchValue.trim() === "") {
      setData(allNotes);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/filterNotes", {
        method: "POST",
        body: JSON.stringify({ search: searchValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error filtering notes:", error);
      setData(allNotes);
    } finally {
      setIsLoading(false);
    }
  }

  function clearSearch() {
    setSearch("");
    setData(allNotes);
  }

  return (
    <Column fillWidth>
      <Input
        label="Search notes"
        id="notes"
        onChange={handleChange}
        value={search}
      />
      {search && (
        <Button variant="secondary" onClick={clearSearch}>
          Clear
        </Button>
      )}
      <Flex direction="column" gap="8" align="start" fillWidth>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : data.length > 0 ? (
          data.map((note, index) => (
            <Card
              key={note.id || index}
              radius="l-4"
              direction="column"
              gap="8"
              padding="12"
              fillHeight
              fillWidth // Ensure cards take full width
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
          ))
        ) : (
          <Text>No results found. Try a different search term.</Text>
        )}
      </Flex>
    </Column>
  );
}

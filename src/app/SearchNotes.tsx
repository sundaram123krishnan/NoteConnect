"use client";
import {
  Badge,
  Button,
  Card,
  Column,
  Flex,
  Input,
  Skeleton,
  Text,
  useToast,
} from "@/once-ui/components";
import type React from "react";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

interface Note {
  id: string;
  title: string;
  categories: string[];
  college: string;
  state: string;
  district: string;
  userId: string;
  notesLink: string;
  likeCount: number;
}

const allNotes: Note[] = [
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
    likeCount: 0,
  },
];

export default function SearchNotes() {
  const [data, setData] = useState<Note[]>(allNotes);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/fetchNotes", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fetchedData: Note[] = await response.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setData(allNotes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchValue = event.target.value;
    setSearch(newSearchValue);

    if (!newSearchValue || newSearchValue.trim().length <= 1) {
      setIsLoading(true);
      fetchNotes();
      return;
    }

    const timeoutId = setTimeout(() => {
      FilterNotes(newSearchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }

  async function fetchNotes() {
    try {
      const response = await fetch("/api/fetchNotes", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const fetchedData: Note[] = await response.json();
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setData(allNotes);
    } finally {
      setIsLoading(false);
    }
  }

  async function FilterNotes(searchValue: string) {
    if (!searchValue.trim()) {
      setData(allNotes);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/filterNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: searchValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData: Note[] = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error filtering notes:", error);
      setData(allNotes);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLikes(noteId: string, userId: string) {
    if (liked) {
      addToast({
        variant: "danger",
        message: "Alread liked the note",
      });
      return;
    }
    setLiked(true);
    try {
      const response = await fetch("/api/fetchNotes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId, userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedNote = await response.json();

      const res = await fetch("/api/likeCount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId }),
      });

      const totalLikes = await res.json();
      console.log(totalLikes);
      setData((prevData) =>
        prevData.map((note) =>
          note.id === noteId ? { ...note, likeCount: totalLikes } : note
        )
      );

      console.log("Updated likes:", updatedNote);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  }

  function clearSearch() {
    setSearch("");
    setIsLoading(true);
    fetchNotes();
  }

  const skeletonCards = [1, 2, 3];

  return (
    <Column fillWidth>
      <Flex fillWidth gap="4" align="center" marginBottom="8">
        <Input
          label="Search notes"
          id="notes"
          onChange={handleChange}
          value={search}
          style={{ width: "100%" }}
        />
        {search && (
          <Button variant="secondary" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </Flex>
      <Flex direction="column" gap="8" align="start" fillWidth>
        {isLoading ? (
          skeletonCards.map((_, index) => (
            <Card
              key={index}
              radius="l-4"
              direction="column"
              gap="8"
              padding="12"
              fillHeight
              fillWidth
            >
              <Skeleton shape="line" />
              <Skeleton shape="line" />
              <Flex gap="4">
                <Skeleton shape="line" />
                <Skeleton shape="line" />
                <Skeleton shape="line" />
              </Flex>
              <Skeleton shape="line" />
            </Card>
          ))
        ) : data.length > 0 ? (
          data.map((note) => (
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
                <Button
                  size="m"
                  variant="primary"
                  className="p-4"
                  onClick={() => handleLikes(note.id, note.userId)}
                >
                  <FaRegHeart />
                  {note.likeCount}
                </Button>
              </Flex>
            </Card>
          ))
        ) : (
          <Text>No results found. Try a different search term.</Text>
        )}
      </Flex>
    </Column>
  );
}

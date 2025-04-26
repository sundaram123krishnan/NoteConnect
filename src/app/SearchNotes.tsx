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
import { authClient } from "../../lib/auth-client";

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
  const [likedNotes, setLikedNotes] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>("");
  const { addToast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await authClient.getSession();
      if (session) {
        setIsAuthenticated(true);
        setCurrentUserId(session.user.id);
        console.log(currentUserId);
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null);
        setLikedNotes(new Set());
        localStorage.removeItem("likedNotes");
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    // Load liked notes from localStorage
    const storedLikes = localStorage.getItem("likedNotes");
    if (storedLikes) {
      setLikedNotes(new Set(JSON.parse(storedLikes)));
    }
  }, []);

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
    // Check if user is authenticated
    if (!isAuthenticated || !currentUserId) {
      addToast({
        variant: "danger",
        message: "Please sign in to like notes",
      });
      return;
    }

    if (likedNotes.has(noteId)) {
      addToast({
        variant: "danger",
        message: "Already liked this note",
      });
      return;
    }

    // Add this note to the liked set and save to localStorage
    const newLikedNotes = new Set([...likedNotes, noteId]);
    setLikedNotes(newLikedNotes);
    localStorage.setItem("likedNotes", JSON.stringify([...newLikedNotes]));

    try {
      const response = await fetch("/api/fetchNotes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId, userId: currentUserId }),
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
      // If there's an error, remove the note from liked set and localStorage
      const updatedLikedNotes = new Set(likedNotes);
      updatedLikedNotes.delete(noteId);
      setLikedNotes(updatedLikedNotes);
      localStorage.setItem(
        "likedNotes",
        JSON.stringify([...updatedLikedNotes])
      );
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
                  title={!isAuthenticated ? "Sign in to like notes" : ""}
                >
                  {likedNotes.has(note.id) ? <FaHeart /> : <FaRegHeart />}
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

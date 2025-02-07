"use server";

import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function UploadNotesAction(formData: FormData) {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user || !user.session || !user.session.id) {
      throw new Error("User not authenticated");
    }

    const title = formData.get("title") as string;
    const state = formData.get("state") as string;
    const collegeName = formData.get("collegeName") as string;
    const district = formData.get("district") as string;
    const fileUrl = formData.get("fileUrl") as string;

    if (!title || !state || !collegeName || !district || !fileUrl) {
      throw new Error("Missing required fields");
    }

    console.log("Attempting to create note with data:", {
      title,
      state,
      district,
      college: collegeName,
      notesLink: fileUrl,
      userId: user.session.id,
    });
    console.log(user.user.id);

    const newNote = await prisma.notes.create({
      data: {
        title,
        state,
        district,
        college: collegeName,
        notesLink: fileUrl,
        user: {
          connect: {
            id: user.user.id,
          },
        },
        categories: ["engineering", "medical"],
      },
    });

    console.log("Note created successfully:", newNote);

    return {
      message: "Successfully uploaded notes",
      note: newNote,
    };
  } catch (error) {
    console.error("Error in UploadNotesAction:", error);
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

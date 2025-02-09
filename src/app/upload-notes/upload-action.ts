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
      return {
        message: "Please Login to upload notes",
      };
    }

    const title = formData.get("title") as string;
    const state = formData.get("state") as string;
    const collegeName = formData.get("collegeName") as string;
    const district = formData.get("district") as string;
    const fileUrl = formData.get("fileUrl") as string;
    const categories = JSON.parse(formData.get("categories") as string);

    if (!title || !state || !collegeName || !district || !fileUrl) {
      return {
        message: "Please fill out add details",
      };
    }

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
        categories,
      },
    });

    return {
      message: "Successfully uploaded notes",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

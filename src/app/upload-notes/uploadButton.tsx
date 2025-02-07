"use client";

import { Button } from "@/once-ui/components";
import { useUploadThing } from "@/utils/uploadThing";
import { useDropzone } from "@uploadthing/react";
import { useCallback, useState, MouseEvent } from "react"; // Added ReactMouseEvent import
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { UploadNotesAction } from "./upload-action";

export default function SingleFileUploader({
  collegeName,
  state,
  district,
  title,
}: {
  collegeName: string;
  state: string;
  district: string;
  title: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      alert("Uploaded successfully!");
      console.log(res[0].appUrl);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("collegeName", collegeName);
      formData.append("state", state);
      formData.append("district", district);
      formData.append("fileUrl", "sample Url");
      UploadNotesAction(formData);
      setLoading(false);
    },
    onUploadError: () => {
      alert("Error occurred while uploading");
      setLoading(false);
    },
    onUploadBegin: () => {
      console.log("Upload has begun for", file?.name);
      setLoading(true);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0] || null);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
    multiple: false,
    disabled: !!file,
  });

  const handleUploadFile = useCallback(() => {
    if (file) {
      startUpload([file]);
      console.log(file);
    }
  }, [file, startUpload]);

  const handleClear = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  }, []);

  return (
    <>
      <div
        {...getRootProps()}
        className={`p-6 rounded-lg text-center ${
          file ? "border-gray-500 bg-gray-100" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="mb-2">Selected file: {file?.name}</p>
        <Button onClick={handleUploadFile} loading={loading}>
          Upload file
        </Button>
        {file ? (
          <Button onClick={handleClear} variant="secondary" className="ml-2">
            Clear selection
          </Button>
        ) : (
          <p>Drag & drop a file here, or click to select a file</p>
        )}
      </div>
    </>
  );
}

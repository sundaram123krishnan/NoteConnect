"use client";

import {
  Badge,
  Button,
  Card,
  Column,
  Flex,
  Grid,
  Input,
  RevealFx,
  Select,
  SmartImage,
  Text,
  useToast,
} from "@/once-ui/components";
import { Districts, States } from "./data";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadThing";
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { UploadNotesAction } from "./upload-action";

const NotesSchema = z.object({
  title: z.string().nonempty("Title is required"),
  state: z.string().nonempty("State is required"),
  district: z.string().nonempty("District is required"),
  categories: z.array(z.string()).nonempty("At least one category is required"),
  collegeName: z.string().nonempty("College is required"),
  fileUrl: z.string().url("Valid file URL is required"),
});

export function UploadNotes() {
  const { addToast } = useToast();

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);

  async function fetchColleges(state: string, district: string) {
    const response = await fetch(
      `https://api.data.gov.in/resource/44bea382-c525-4740-8a07-04bd20a99b52?api-key=579b464db66ec23bdd000001b5724e0b5e5440d86288ad2a5d8cb40b&format=json&limit=5000&filters%5Bstate_name%5D=${state}&filters%5Bdistrict_name%5D=${district}`
    );
    const data = await response.json();

    const collegeList = data.records.map(
      (college: { college_name: string }) => ({
        label: college.college_name,
        value: college.college_name,
      })
    );

    setColleges(collegeList);
  }

  function selectState(value: string) {
    setSelectedCollege("");
    setState(value);
  }

  async function selectDistrict(value: string) {
    setSelectedCollege("");
    setDistrict(value);
  }

  useEffect(() => {
    fetchColleges(state, district);
  }, [state, district]);

  async function selectColleges(value: string) {
    setSelectedCollege(value);
  }

  function addCategory() {
    setCategories([...categories, category]);
    setCategory("");
  }

  function removeCategory(index: number) {
    const removedCategories = categories.filter((_, i) => i !== index);
    setCategories(removedCategories);
  }

  const handleServerUpload = useCallback(
    async (fileUrl: string) => {
      const notes = {
        title,
        state,
        district,
        categories,
        collegeName: selectedCollege,
        fileUrl,
      };

      const result = NotesSchema.safeParse(notes);

      if (!result.success) {
        setFormErrors(result.error.issues);
        setUploadStatus("Validation failed");
        addToast({
          message: "Please fill all required fields",
          variant: "danger",
        });
        setLoading(false);
        return;
      }
      setFormErrors([]);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("state", state);
      formData.append("district", district);
      formData.append("collegeName", selectedCollege);
      formData.append("categories", JSON.stringify(categories));
      formData.append("fileUrl", fileUrl);
      try {
        const uploadResponse = await UploadNotesAction(formData);
        setUploadStatus("Upload successful");
        addToast({
          message: "Successfully uploaded notes",
          variant: "success",
        });
        setState("");
        setDistrict("");
        setSelectedCollege("");
        setTitle("");
        setFile(null);
        setCategories([]);
        setUploadStatus("");
      } catch (error) {
        setUploadStatus("Upload failed");
        addToast({
          message: "Error uploading notes",
          variant: "danger",
        });
      } finally {
        setLoading(false);
      }
    },
    [title, selectedCollege, state, district, categories, addToast]
  );

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const fileUrl = res[0].appUrl;
      handleServerUpload(fileUrl);
    },
    onUploadError: () => {
      setUploadStatus("Upload failed");
      setLoading(false);
      addToast({
        variant: "danger",
        message: "Upload failed",
      });
    },
    onUploadBegin: () => {
      console.log("Upload has begun for", file?.name);
      setLoading(true);
      setUploadStatus(null);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0] || null);
    setUploadStatus(null);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
    multiple: false,
  });

  const handleUploadFile = useCallback(() => {
    if (file) {
      startUpload([file]);
    }
  }, [file, startUpload]);

  return (
    <RevealFx speed="medium" delay={0} translateY={0}>
      <Column fillWidth>
        <Card
          radius="l-4"
          direction="column"
          gap="16"
          padding="16"
          height={44}
          fillWidth
          background="transparent"
          border="transparent"
        >
          <Flex direction="row" gap="4" horizontal="space-between" center>
            <SmartImage
              src="/images/image.png"
              alt="Image description"
              width={4}
              height={4}
            />
            <Text variant="body-strong-xl">Upload Notes</Text>
          </Flex>
          <Input
            id="title"
            label="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            id="state"
            label="Select State"
            options={States}
            value={state}
            onSelect={selectState}
          />
          <Select
            id="district"
            label="Select District"
            options={Districts}
            value={district}
            onSelect={selectDistrict}
          />
          <Select
            id="college"
            label="Select College"
            options={colleges}
            value={selectedCollege}
            onSelect={selectColleges}
          />
          <Flex center gap="4">
            <Input
              id="categories"
              label="Add categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Button
              variant="tertiary"
              size="l"
              prefixIcon="plus"
              onClick={addCategory}
            />
          </Flex>

          <Flex>
            {categories.length > 0 ? (
              <Grid gap="4" columns="4">
                {categories.map((category, index) => (
                  <Badge key={index} onClick={() => removeCategory(index)}>
                    {category}
                  </Badge>
                ))}
              </Grid>
            ) : (
              <></>
            )}
          </Flex>
          {formErrors.find((error) => error.path[0] === "categories") && (
            <Text color="danger">
              {
                formErrors.find((error) => error.path[0] === "categories")
                  ?.message
              }
            </Text>
          )}
          <Flex direction="column" gap="8">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Button>Select file</Button>
            </div>
            {file && (
              <Flex direction="column" gap="8">
                <Flex gap="4">
                  <Text>{file.name}</Text>
                </Flex>
                <Button
                  onClick={handleUploadFile}
                  loading={loading}
                  disabled={!file || loading}
                >
                  Upload
                </Button>
              </Flex>
            )}
          </Flex>
        </Card>
      </Column>
    </RevealFx>
  );
}

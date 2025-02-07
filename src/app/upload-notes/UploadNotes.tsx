"use client";

import {
  Card,
  Column,
  Input,
  RevealFx,
  Select,
  Text,
  useToast,
} from "@/once-ui/components";
import { Districts, States } from "./data";
import { useEffect, useState } from "react";
import MultiUploader from "./uploadButton";
import { z } from "zod";

const NotesSchema = z.object({
  title: z.string(),
  state: z.string(),
  district: z.string(),
  categories: z.array(z.string()),
  colleges: z.array(z.string()),
});

export function UploadNotes() {
  const { addToast } = useToast();

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

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [title, setTitle] = useState("");

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

  return (
    <RevealFx speed="medium" delay={0} translateY={0}>
      <Column>
        <Card
          radius="l-4"
          direction="column"
          gap="16"
          horizontal="center"
          padding="16"
          height={40}
          background="brand-medium"
          fillWidth
        >
          <Text variant="body-strong-xl">Upload Notes</Text>
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
          <MultiUploader
            title={title}
            collegeName={selectedCollege}
            state={state}
            district={district}
          />
        </Card>
      </Column>
    </RevealFx>
  );
}

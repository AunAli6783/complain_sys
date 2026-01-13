
import React, { useState } from "react";
import { addComplaint } from "../lib/storage";

export default function Complain() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    addComplaint({
      title,
      description
    });

    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
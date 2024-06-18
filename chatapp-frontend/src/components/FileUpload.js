// src/components/FileUpload.js
import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Typography, Alert, Input } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Chat from "./Chat";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [documentId, setDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const res = await axios.post("http://localhost:3000/upload", formData);
      setMessage("File uploaded successfully");
      setDocumentId(res.data.documentId); // Set the document ID from the response
      setIsLoading(false);
      console.log(res.data);
    } catch (err) {
      setMessage("Failed to upload file");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload PDF
      </Typography>
      <Input type="file" onChange={onFileChange} />
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={onFileUpload}
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </Button>
      {message && (
        <Alert
          severity={message.includes("successfully") ? "success" : "error"}
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}
      {documentId && <Chat documentId={documentId} />}
    </Box>
  );
};

export default FileUpload;

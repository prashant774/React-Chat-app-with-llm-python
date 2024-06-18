// src/App.js
import React from "react";
import { Container, CssBaseline, Typography } from "@mui/material";
import FileUpload from "./components/FileUpload";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom>
          LLM Powered Chat for Document Exploration
        </Typography>
        <FileUpload />
      </Container>
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        Note* - Python LLM model performance need to be improve for fast api
        response.
      </p>
    </div>
  );
}

export default App;

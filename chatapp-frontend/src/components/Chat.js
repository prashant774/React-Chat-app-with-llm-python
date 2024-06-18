// src/components/Chat.js
import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Alert, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ documentId }) => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChatSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post("http://localhost:3000/chat", {
        documentId,
        message,
      });
      setResponse(res.data.response);
      setIsLoading(false);
    } catch (err) {
      setResponse("Failed to get response");
      console.error(err);
      setIsLoading(false);
    }
  };

  const parseResponse = (response) => {
    const answer = response
      .split("Sentiment Analysis:")[0]
      .replace("Answer:\r\n", "")
      .trim();
    const sentimentAnalysis = response
      .split("Sentiment Analysis:")[1]
      ?.split("Probability of correctness:")[0]
      .trim();
    const probability = response
      .split("Probability of correctness:")[1]
      ?.trim();
    return { answer, sentimentAnalysis, probability };
  };

  const parsedResponse = parseResponse(response);

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h5" gutterBottom>
            Chat
          </Typography>
          <TextField
            label="Ask your question"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={onChatSubmit}
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </Grid>
        <Grid item xs={6}>
          {response && (
            <Alert severity="info" sx={{ mt: 2, textAlign: "left" }}>
              <p>
                <strong>Answer:</strong> {parsedResponse.answer}
              </p>
              <p>
                <strong>Sentiment Analysis:</strong>{" "}
                {parsedResponse.sentimentAnalysis}
              </p>
              <p>
                <strong>Probability of correctness:</strong>{" "}
                {parsedResponse.probability}
              </p>
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat;

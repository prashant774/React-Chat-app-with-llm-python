const { spawn } = require("child_process");

const processChat = async (req, res) => {
  try {
    const { documentId, message } = req.body;
    const pool = req.pool;

    const documentResult = await pool.query(
      "SELECT path FROM documents WHERE id = $1",
      [documentId]
    );
    const documentPath = documentResult.rows[0].path;

    const pythonProcess = spawn("python", [
      "../combined_nlp_bert.py",
      documentPath,
      message,
    ]);

    let responseData = "";

    pythonProcess.stdout.on("data", (data) => {
      responseData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr2: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
      console.log(`child process exited with code ${code}`);

      const chatResult = await pool.query(
        "INSERT INTO chats (document_id, message, response) VALUES ($1, $2, $3) RETURNING id",
        [documentId, message, responseData]
      );
      const chatId = chatResult.rows[0].id;

      res
        .status(200)
        .send({ message: "Chat processed", chatId, response: responseData });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { processChat };

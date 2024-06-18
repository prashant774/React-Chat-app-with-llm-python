const multer = require("multer");
const { spawn } = require("child_process");

const upload = multer({ dest: "uploads/" });

const uploadFile = async (req, res) => {
  try {
    const { file } = req;
    const { originalname, path } = file;
    const pool = req.pool;
    const userId = 1;

    const result = await pool.query(
      "INSERT INTO documents (user_id, name, path) VALUES ($1, $2, $3) RETURNING id",
      [userId, originalname, path]
    );
    const documentId = result.rows[0].id;

    const pythonProcess = spawn("python", [
      "../combined_nlp_bert.py",
      path,
      "",
    ]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr1: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      res
        .status(200)
        .send({ message: "File uploaded and processed", documentId });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { upload, uploadFile };

const { express, client } = require("./common");
const app = express();
const PORT = process.env.PORT || 3000;

// parse the body into JS Objects
app.use(express.json());

// Log the requests as they come in
app.use(require("morgan")("dev"));

app.get("/api/notes", async (req, res, next) => {
  try {
    const SQL = `;
    SELECT * from notes ORDER BY created_at DESC;
`;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/notes", async (req, res, next) => {
  try {
    const { txt, ranking } = req.body;
    const SQL = `;
        INSERT INTO notes(txt, ranking) VALUES($1, $2) RETURNING *;
    `;
    const response = await client.query(SQL, [txt, ranking]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { txt, ranking } = req.body;
    const SQL = `
          UPDATE notes 
          SET txt = $1, ranking = $2, updating_at=now()
          WHERE id = $3
          RETURNING *
      `;
    const response = await client.query(SQL, [txt, ranking, id]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
        DELETE FROM notes WHERE id = $1;
    `;
    await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, async () => {
  await client.connect();
  console.log(`I am listening on port number ${PORT}`);
});

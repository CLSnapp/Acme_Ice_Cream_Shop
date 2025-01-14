const { express, client } = require("./common");
const app = express();
const PORT = process.env.PORT || 3000;

// parse the body into JS Objects
app.use(express.json());

// Log the requests as they come in
app.use(require("morgan")("dev"));

app.get("/api/flavors", async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from flavors ORDER BY created_at DESC;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/flavors/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
      SELECT * from flavors WHERE id = $1;
    `;
    const response = await client.query(SQL, [id]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/flavors", async (req, res, next) => {
  try {
    const { name, is_favorite } = req.body;
    const SQL = `
      INSERT INTO flavors(name, is_favorite)
      VALUES($1, $2)
      RETURNING *;
    `;
    const response = await client.query(SQL, [name, is_favorite]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/flavors/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, is_favorite } = req.body;
    const SQL = `
      UPDATE flavors
      SET name=$1, is_favorite=$2, updated_at=now()
      WHERE id=$3 
      RETURNING *;
    `;
    const response = await client.query(SQL, [name, is_favorite, id]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/flavors/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
      DELETE from flavors
      WHERE id = $1
    `;
    const response = await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, async () => {
  await client.connect();
  console.log(`I am listening on port number ${PORT}`);
});

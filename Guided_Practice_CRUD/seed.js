const { client } = require("./common");

const seed = async () => {
  try {
    await client.connect();
    console.log("connected to database");
    const SQL = `
    DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
     id  SERIAL PRIMARY KEY,
     txt VARCHAR(255) NOT NULL,
     ranking INTEGER DEFAULT 3 NOT NULL,
     created_at TIMESTAMP DEFAULT now(),
     updated_at TIMESTAMP DEFAULT now()
    );

    INSERT INTO notes(txt, ranking) VALUES('learn express', 5),
    INSERT INTO notes(txt, ranking) VALUES('write SQL queries', 4),
    INSERT INTO notes(txt, ranking) VALUES('create routes', 2);
   `;

    await client.query(SQL);
    await client.end();
    console.log("tables created and data seeded");
  } catch (error) {
    console.log(error);
  }
};

seed();

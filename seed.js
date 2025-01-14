const { client } = require("./common");

const seed = async () => {
  try {
    await client.connect();
    console.log("connected to database");
    const SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
     id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(100) NOT NULL,
     is_favorite BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT now(),
     updated_at TIMESTAMP DEFAULT now()
    );

    INSERT INTO flavors(name, is_favorite) VALUES
    ('Vanilla', true),
    ('Chocolate Mint', false),
    ('Twist', false),
    ('Cookie Dough', true),
    ('Birthday Cake', false),
    ('Pecan Praline', false),
    ('Butter Pecan', true),
    ('Caramel', false),
    ('Cotton Candy', true),
    ('Pistachio', false),
    ('Beer Batter', false),
    ('Cookies and Cream', true); 
`;

    await client.query(SQL);
    await client.end();
    console.log("Tables created and data seeded");
  } catch (error) {
    console.log(error);
  }
};

seed();

import express, { type Request, type Application, type Response } from "express";
import {Pool} from "pg";
import "dotenv/config";
const app : Application = express();
const port = 5000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString : process.env.DATABASE_URL,
});

// console.log(pool);

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INT,
      is_Active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
    console.log("Database connected!!");
  } catch (error) {
    console.log(error);
  }
};


app.get('/', (req : Request, res : Response) => {
  console.log(req);
  // res.send('This is root route');
  res.status(200).json({
    success : true,
    message : "This is root route",
  });
});

// Create Users (POST Method)
app.post("/api/v1/users", async (req : Request, res : Response) => {
  try {
    const {name, email, password, age} = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email, password, age)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [name, email, password, age]
    );

    res.status(201).json({
      success : true,
      message : "User created",
      data : result.rows[0],
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
});


// Getting All Users (GET Method)
app.get("/api/v1/users", async (req : Request, res : Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users`
    );

    res.status(200).json({
      success : true,
      message : "User retrived successfully",
      data : result.rows,
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
});


// Single user with params
app.get("/api/v1/users/:id", async (req : Request, res : Response) => {
  try {
    const {id} = req.params;
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success : false,
        message : "User not found",
      });
    }
    
    res.status(200).json({
      success : true,
      message : "User retrived successfully",
      data : result.rows[0],
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
});


// Update User with the PUT method
app.put("/api/v1/users/:id", async (req : Request, res : Response) => {
  try {
    const {id} = req.params;
    const {name, password, age, is_Active} = req.body;
    const result = await pool.query(
      `UPDATE users
      SET
      name = COALESCE($1, name),
      password = COALESCE($2, password),
      age = COALESCE($3, age),
      is_Active = COALESCE($4, is_Active),
      updated_at = NOW() 
      WHERE id = $5 RETURNING *`,
      [name ?? null, password ?? null, age ?? null, is_Active ?? null, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success : false,
        message : "User not found",
      });
    }

    res.status(200).json({
      success : true,
      message : "User updated successfully",
      data : result.rows[0],
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
});

// Delete User with Delete Method
app.delete("/api/v1/users/:id", async (req : Request, res : Response) => {
  try {
    const {id} = req.params;
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success : false,
        message : "User not found",
      });
    }

    res.status(200).json({
      success : true,
      message : "User deleted successfully",
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
});


app.post("/", async (req : Request, res : Response) => {
  // console.log(req.body)
  const body = req.body;
    res.status(200).json({
    success : true,
    message : "This is a test api",
    data : body,
  });
});

async function startServer(){
  try {
      // const client = await pool.connect();
      // console.log(client);
      initDB();

      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      });
  } catch (error) {
    console.log(error)
  }
}

startServer();
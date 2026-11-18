import express, { type Request, type Application, type Response } from "express";
import {Pool} from "pg";
const app : Application = express();
const port = 5000


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString : "postgresql://neondb_owner:npg_EoIG59AnzewH@ep-long-wave-aol70ht2-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require",
  // connectionString: "postgresql://postgres:RafiulTalukdar@db.ymzbtpwhljnigdysgokv.supabase.co:5432/postgres"
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
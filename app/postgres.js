const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const { Pool } = require("pg");

const pool = new Pool({
  user: dbUser,
  host: process.env.DB_HOST || "postgres",
  database: dbName,
  password: dbPassword,
  port: 5432,
});


async function getPosts() {
  try {
    const result = await pool.query("SELECT name, content, timestamp FROM posts ORDER BY timestamp DESC");
    return result.rows;
  } catch (error) {
    console.error("Error retrieving posts:", error);
    throw error;
  }
}


async function addPost(post) {
  try {
    const { name, content, timestamp } = post;
    await pool.query("INSERT INTO posts (name, content, timestamp) VALUES ($1, $2, $3)", [
      name,
      content,
      timestamp,
    ]);
  } catch (error) {
    console.error("Error while adding posts:", error);
    throw error;
  }
}

module.exports = { getPosts, addPost };
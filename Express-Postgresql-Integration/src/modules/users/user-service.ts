import { pool } from "../../db";
import { IUpdateUser, IUser } from "./user-interface";
import bcrypt from 'bcryptjs';


// Create Users
const createUserIntoDB = async (payload : IUser) => {
  const {name, email, password, age} = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, age)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [name, email, hashPassword, age]
  );
  delete result.rows[0].password;
  return result;
}


// Getting All Users
const getAllUsersFromDB = async () => {

    const result = await pool.query(
      `SELECT id, name, email, age, is_Active, created_at, updated_at FROM users`
    );
    return result;
}


// Single user with params
const getSingleUserDB = async (id : string) => {
    const result = await pool.query(
      `SELECT id, name, email, age, is_Active, created_at, updated_at FROM users WHERE id = $1`,
      [id],
    );
    return result;
}


// Update User
const updateUserBD = async (payload : IUpdateUser, id : string) => {
    const {name, password, age, is_Active} = payload;
    const hashPassword = password ? await bcrypt.hash(password, 10) : null;
    const result = await pool.query(
      `UPDATE users
      SET
      name = COALESCE($1, name),
      password = COALESCE($2, password),
      age = COALESCE($3, age),
      is_Active = COALESCE($4, is_Active),
      updated_at = NOW() 
      WHERE id = $5 RETURNING *`,
      [name ?? null, hashPassword, age ?? null, is_Active ?? null, id]
    );
    if (result.rows[0]) {
      delete result.rows[0].password;
    }
    return result;
}


// Delete User
const deleteUserDB = async (id : string) => {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );
    return result;
}



export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserDB,
    updateUserBD,
    deleteUserDB,
}
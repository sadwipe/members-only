import pool from './pool.js';

export async function findUserById(id) {
  const SQL = `
    SELECT *
    FROM users
    WHERE id = $1
  `;

  const { rows } = await pool.query(SQL, [id]);

  return rows[0] || null;
}

export async function findUserByUsername(username) {
  const SQL = `
    SELECT *
    FROM users
    WHERE username = $1
  `;

  const { rows } = await pool.query(SQL, [username]);

  return rows[0] || null;
}

export async function createUser(firstName, lastName, username, passwordHash) {
  const SQL = `
    INSERT
    INTO users (first_name, last_name, username, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id, first_name as "firstName", last_name as "lastName", username, membership_status as status, is_admin as "isAdmin"
  `;

  const { rows } = await pool.query(SQL, [
    firstName,
    lastName,
    username,
    passwordHash,
  ]);

  return rows[0] || null;
}

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

export async function findUserByName(name) {
  const SQL = `
    SELECT *
    FROM users
    WHERE name = $1
  `;

  const { rows } = await pool.query(SQL, [name]);

  return rows[0] || null;
}

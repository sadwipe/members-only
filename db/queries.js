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

export async function getAllMessages() {
  const SQL = `
    SELECT messages.id, title, text, timestamp, first_name, last_name
    FROM messages
    JOIN users
    ON messages.user_id = users.id
  `;

  const { rows } = await pool.query(SQL);

  return rows;
}

export async function updateUserMembership(id) {
  const SQL = `
    UPDATE users
    SET membership_status = true
    WHERE id = $1
  `;
  return await pool.query(SQL, [id]);
}

export async function createMessage(id, title, message) {
  const SQL = `
    INSERT
    INTO messages (user_id, title, text)
    VALUES ($1, $2, $3)
    RETURNING title, text as "message"
  `;

  const { rows } = await pool.query(SQL, [id, title, message]);
  return rows[0] || null;
}

export async function updateUserAdminStatus(userId, status) {
  const SQL = `
    UPDATE users
    SET is_admin = $2
    WHERE id = $1
  `;

  return await pool.query(SQL, [userId, status]);
}

export async function findUserMessageByTitle(userId, title) {
  const SQL = `
    SELECT messages.id
    FROM messages
    JOIN users
    ON messages.user_id = $1
    WHERE title = $2
  `;

  const { rows } = await pool.query(SQL, [userId, title]);

  return rows[0] || null;
}

export async function deleteMessage(messageId) {
  const SQL = `
    DELETE
    FROM messages
    WHERE id = $1
  `;

  return await pool.query(SQL, [messageId]);
}

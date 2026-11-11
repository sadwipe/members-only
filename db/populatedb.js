import crypto from 'crypto';
import bcrypt from 'bcrypt';
import pool from './pool.js';

const generatePassword = (
  length = 20,
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => characters[x % characters.length])
    .join('');

async function seed() {
  const passwords = [];

  for (let i = 0; i < 4; i++) {
    const randomPassword = generatePassword();
    passwords.push(randomPassword);
  }

  const hashedPasswords = await Promise.all(
    passwords.map((password) => bcrypt.hash(password, 10))
  );

  const createTablesQuery = `
    CREATE EXTENSION IF NOT EXISTS citext;

    DROP TABLE IF EXISTS "messages";
    DROP TABLE IF EXISTS "session";
    DROP TABLE IF EXISTS "users";

    CREATE TABLE users (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      username VARCHAR(30) UNIQUE NOT NULL,
      email CITEXT UNIQUE NOT NULL CHECK (length(email) <= 254),
      password_hash VARCHAR(255) NOT NULL,
      membership_status BOOLEAN NOT NULL DEFAULT FALSE,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE
    );

    CREATE TABLE messages (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(50) NOT NULL,
      text VARCHAR(300) NOT NULL,
      timestamp DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `;

  const insertUsersQuery = `
    INSERT INTO users (first_name, last_name, username, email, password_hash)
    VALUES
      ('Natalie', 'Parsons', 'natalieparsons', 'natalieparsons@gmail.com', $1),
      ('Lewis', 'Brewer', 'lewisbrewer', 'lewisbrewer@gmail.com', $2),
      ('Abram', 'Sharp', 'abramsharp', 'abramsharp@gmail.com', $3),
      ('Baylor', 'Booker', 'baylorbooker', 'baylorbooker@gmail.com', $4);
  `;

  const insertMessagesQuery = `
    INSERT INTO messages (user_id, title, text)
    VALUES
      (1, 'Welcome to the Club!', 'Glad to finally be here. Looking forward to sharing thoughts and seeing what everyone else posts.'),
      (4, 'Server Maintenance Notice', 'Quick reminder that the local cluster will restart tonight around 02:00 for routine package updates.'),
      (2, 'Best Coffee Beans in Town', 'Does anyone have recommendations for light roasts with floral notes? Running low on Ethiopian single origins.'),
      (3, 'Reading Recommendations', 'Just finished a heavy classic novel and need something gripping to read next. Any genre welcome.'),
      (4, 'Secret Clubhouse Rules', 'Remember: the first rule of the club is that non-members cannot see who authors the posts.'),
      (3, 'Morning Routine Optimization', 'Cutting down screen time before 8 AM made a surprisingly big difference to my focus this week.'),
      (1, 'Weekend Running Route', 'Did an easy 8k run early this morning around the reservoir. Crisp weather and almost completely empty paths.'),
      (2, 'Pizza Dough Experiments', 'Switched from a quick 2-hour yeast proof to a 20-hour cold ferment. The crust texture and flavor are on another level.');
  `;

  try {
    await pool.query(createTablesQuery);
    await pool.query(insertUsersQuery, hashedPasswords);
    await pool.query(insertMessagesQuery);
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
  }
}

seed();

const assert = require('assert');
const sqlite = require('sqlite');

// for raw queries
import SQL from 'sql-template-strings';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = 'THISISSOSECRET';
const saltRounds = 10;

/* Warning: hardcoded db name */

const dbName = './vulnerable.sqlite';

async function findUser(db, username) {
  /* Warning: ripe for injection! *cough* 'OR 1=1'*/
  const user = await db.get(SQL`select * from patient where username = ${username}`);
  // const user = await db.get('select * from patient where username = ?', [username]);

  /* Warning: having plain text passwords not a good idea*/
  // hash pass if it's not hashed
  // if (user?.password.substring(0, 2) !== '$2') {
  //   console.log('Hashing password...');
  //   bcrypt.hash(user.password, saltRounds).then(async function (hash) {
  //     const statement = await db.prepare('UPDATE patient SET password = ? where username = ?');
  //     const result = await statement.run(hash, username);
  //     result.finalize();
  //   });
  // }

  return user;
}

function authUser(password, hash, callback) {
  bcrypt.compare(password, hash, callback);
}

export default async (req, res) => {
  if (req.method !== 'POST') return;

  try {
    assert.notStrictEqual(null, req.body.email, 'Email required');
    assert.notStrictEqual(null, req.body.password, 'Password required');
  } catch (bodyError) {
    res.status(403).send(bodyError.message);
  }

  const db = await sqlite.open(dbName);

  const { username, password } = req.body;

  const user = await findUser(db, username);

  if (!user) {
    res.status(404).json({ error: true, message: 'User not found' });
  } else {
    authUser(password, user.password, function (err, match) {
      console.log('💩 ~ file: auth.js ~ line 59 ~ match', match);
      if (err) {
        res.status(500).json({ error: true, message: 'Auth Failed' });
      }
      // user found & retrieved
      if (match) {
        console.log('💩 ~ file: auth.js ~ line 63 ~ match', match);
        const token = jwt.sign({ userId: user.userId, username: user.username }, jwtSecret, {
          expiresIn: 3000, //50 minutes
        });
        res.status(200).json({ token });
        return;
      } else {
        res.status(401).json({ error: true, message: 'Auth Failed' });
        return;
      }
    });
  }

  // res.status(200).json({ user });
};

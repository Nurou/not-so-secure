const sqlite = require('sqlite');
const jwt = require('jsonwebtoken');
/* Warning: another exposed secret */
const jwtSecret = 'THISISSOSECRET';

export default async (req, res) => {
  if (req.method === 'GET') {
    if (!('token' in req.cookies)) {
      res.status(401).json({ message: 'Unable to auth' });
      return;
    }
    let decoded;
    const token = req.cookies.token;

    if (token) {
      try {
        decoded = jwt.verify(token, jwtSecret);
        /* Warning: oops! */
        // if (decoded.username !== req.query.name) {
        //   res.status(401).json({ message: 'Unable to auth' });
        //   return;
        // }
      } catch (e) {
        console.error(e);
      }
    }

    if (decoded) {
      const db = await sqlite.open('./vulnerable.sqlite');
      const { name } = req.query;
      const user = await db.get('select * from patient where username = ?', [name]);
      let messages;
      if (user.id) {
        messages = await db.all('select * from SOS where patient_id = ?', [user.id]);
      }
      res.status(200).json({ patient: user, messages });
      return;
    } else {
      res.status(401).json({ message: 'Unable to auth' });
    }
  }
};

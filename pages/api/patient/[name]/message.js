const sqlite = require('sqlite');
const jwt = require('jsonwebtoken');
/* Warning: another exposed secret */
const jwtSecret = 'THISISSOSECRET';

export default async (req, res) => {
  if (req.method === 'POST') {
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
        if (decoded.username !== req.query.name) {
          res.status(401).json({ message: 'Unable to auth' });
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (decoded) {
      const db = await sqlite.open('./vulnerable.sqlite');
      // get user doctor
      const doctor = await db.get('select * from doctor where patientId = ?', [req.body.id]);
      const message = await db.run('INSERT INTO SOS (patient_id, doctor_id, message) VALUES (?, ?, ?)', [
        req.body.id,
        doctor.id,
        req.body.message,
      ]);
      res.status(200).json({ message });
      return;
    } else {
      res.status(401).json({ message: 'Unable to auth' });
    }
  }
};

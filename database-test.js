const sqlite = require('sqlite');

async function setup() {
  const db = await sqlite.open('./vulnerable.sqlite');
  await db.migrate({ force: 'last' });

  const patients = await db.all('SELECT * FROM Patient');
  console.log('ALL Patients', JSON.stringify(patients, null, 2));

  const doctors = await db.all('SELECT * FROM Doctor');
  console.log('ALL Doctors', JSON.stringify(doctors, null, 2));

  const messages = await db.all('SELECT * FROM Sos');
  console.log('ALL Messages', JSON.stringify(messages, null, 2));
}

setup();

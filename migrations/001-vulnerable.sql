-- Up
CREATE TABLE IF NOT EXISTS Patient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT,
    password TEXT,
    health_conditions TEXT
);

CREATE TABLE IF NOT EXISTS SOS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL REFERENCES Patient(id),
    doctor_id  INTEGER NOT NULL REFERENCES Doctor(id),
    message TEXT
);

CREATE TABLE IF NOT EXISTS Doctor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT,
    password TEXT,
    patientId INTEGER REFERENCES Patient(id)
);

INSERT INTO Patient (name, username, password, health_conditions) values ('alice', 'alice', 'redqueen', 'heart disease, cancer, asthma');
INSERT INTO Patient (name, username, password, health_conditions) values ('joel', 'joel', 'password', 'back pain, hayfever');

INSERT INTO Doctor (name, username, password, patientId) values ('bob', 'bob', 'squarepants', 1);
INSERT INTO Doctor (name, username, password, patientId) values ('big doctor', 'big_doctor', 'squarepants', 2);

INSERT INTO SOS (patient_id, doctor_id, message) values (1, 1, "I'm sick! Please help!");
INSERT INTO SOS (patient_id, doctor_id, message) values  (1, 1, "Omg. I'm bleeding now.") ;

-- Down
DROP TABLE Patient;
DROP TABLE Doctor;
DROP TABLE Sos;
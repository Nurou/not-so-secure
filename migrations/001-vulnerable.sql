-- Up
CREATE TABLE Patient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT,
    password TEXT
);

CREATE TABLE Doctor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT,
    password TEXT,
    patientId INTEGER REFERENCES Patient(id)
);

INSERT INTO Patient (name, username, password) values ('alice', 'alice', 'redqueen');
INSERT INTO Patient (name, username, password) values ('joel', 'joel', 'password');

INSERT INTO Doctor (name, username, password, patientId) values ('bob', 'bob', 'squarepants', 1);
INSERT INTO Doctor (name, username, password, patientId) values ('big doctor', 'big_doctor', 'squarepants', 2);

-- Down
DROP TABLE Patient;
DROP TABLE Doctor;
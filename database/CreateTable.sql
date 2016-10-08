CREATE TABLE Journal (
    time DATETIME NOT NULL PRIMARY KEY,
    name VARCHAR(16) NOT NULL,
    item VARCHAR(32) NOT NULL,
    price SMALLINT NOT NULL,
    paid BOOLEAN
);

CREATE TABLE Drinks (
    id SMALLINT NOT NULL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    price INT NOT NULL
);

CREATE TABLE Users (
    id VARCHAR(32) NOT NULL PRIMARY KEY,
    name VARCHAR(16) NOT NULL,
    email VARCHAR(128) NOT NULL,
    password CHAR(64) NOT NULL
);

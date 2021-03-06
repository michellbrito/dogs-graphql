DROP DATABASE IF EXISTS Animals;
CREATE DATABASE Animals;
USE Animals;

DROP TABLE IF EXISTS owners;
CREATE TABLE owners(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS pets;
CREATE TABLE pets(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
breed VARCHAR(255) NOT NULL,
color VARCHAR(255) NOT NULL,
size VARCHAR(255) NOT NULL,
img VARCHAR(255) NOT NULL,
owner_id INT,
FOREIGN KEY (owner_id) REFERENCES owners(id)
);
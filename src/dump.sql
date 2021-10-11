CREATE DATABASE contact_book;

CREATE TABLE users (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       email varchar(320) UNIQUE NOT NULL,
                       password varchar(30) NOT NULL);

CREATE TABLE contacts (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          first_name VARCHAR(20) NOT NULL,
                          last_name VARCHAR(20),
                          phone VARCHAR(11),
                          email VARCHAR(320),
                          other VARCHAR(1000),
                          user_id INT,
                          FOREIGN KEY (user_id) REFERENCES users (id)
);

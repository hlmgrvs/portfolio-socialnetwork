DROP TABLE IF EXISTS bio;

CREATE TABLE bio(
    id SERIAL PRIMARY KEY,
    bio VARCHAR(300),
    user_id INTEGER NOT NULL UNIQUE
);
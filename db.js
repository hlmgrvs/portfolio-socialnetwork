const spicedPg = require("spiced-pg");
const { dbUser, dbPass } = require("./secrets");
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/social`);
}

module.exports.addUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [first, last, email, password]
    );
};

module.exports.getUserData = function(email) {
    return db.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email]
    );
};

module.exports.getUserProfile = function(userId) {
    return db.query(
        `SELECT users.first AS first, users.last AS last, users.id AS id, images.url AS url, bio.bio AS bio
        FROM users
        LEFT JOIN images
        ON users.id = images.user_id
        LEFT JOIN bio
        ON users.id = bio.user_id
        WHERE users.id = $1`,
        [userId]
    );
};

module.exports.addImage = function(url, user_id) {
    return db.query(
        `INSERT INTO images (url, user_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET url = $1
        RETURNING url`,
        [url, user_id]
    );
};

module.exports.addBio = function(bio, user_id) {
    return db.query(
        `INSERT INTO bio (bio, user_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET bio = $1
        RETURNING bio`,
        [bio, user_id]
    );
};

module.exports.getOtherUser = function(userId) {
    return db.query(
        `SELECT users.first AS first, users.last AS last, users.id AS id, images.url AS url, bio.bio AS bio
        FROM users
        LEFT JOIN images
        ON users.id = images.user_id
        LEFT JOIN bio
        ON users.id = bio.user_id
        WHERE users.id = $1`,
        [userId]
    );
};

module.exports.getInitialFriendship = function(loggedInId, otherUserId) {
    return db.query(
        `SELECT *
        FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`,
        [loggedInId, otherUserId]
    );
};

module.exports.befriend = function(loggedInId, otherUserId) {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2)`,
        [loggedInId, otherUserId]
    );
};

module.exports.unfriend = function(loggedInId, otherUserId) {
    return db.query(
        `DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`,
        [loggedInId, otherUserId]
    );
};

module.exports.accept = function(loggedInId, otherUserId) {
    return db.query(
        `UPDATE friendships SET accepted = true
        WHERE (recipient_id = $1 AND sender_id = $2)`,
        [loggedInId, otherUserId]
    );
};

module.exports.allFriendships = function(loggedInId) {
    return db.query(
        `
    SELECT users.first AS first, users.last AS last, users.id AS id, friendships.accepted AS accepted, images.url AS url
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
    LEFT JOIN images
    ON users.id = images.user_id
    `,
        [loggedInId]
    );
};

module.exports.getUsersByIds = function(arrayOfIds) {
    const query = `SELECT users.first AS first, users.last AS last, users.id AS id, images.url AS url
    FROM users
    LEFT JOIN images
    ON users.id = images.user_id
    LEFT JOIN chat
    ON users.id = chat.user_id
    WHERE users.id = ANY($1)`;
    return db.query(query, [arrayOfIds]);
};

module.exports.getMessages = function() {
    const query = `SELECT users.id AS sender_id, users.first AS sender_first, users.last AS sender_last, images.url AS sender_url, message, chat.id AS message_id, chat.ts AS message_created_at
    FROM chat
    LEFT JOIN users
    ON chat.user_id = users.id
    LEFT JOIN images
    ON chat.user_id = images.user_id
    ORDER BY chat.ts DESC
    LIMIT 10`;
    return db.query(query);
};

module.exports.addMessage = function(message, user_id) {
    return db.query(
        `INSERT INTO chat (message, user_id)
        VALUES ($1, $2)
        RETURNING *`,
        [message, user_id]
    );
};

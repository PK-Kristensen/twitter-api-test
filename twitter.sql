CREATE TABLE users ( 
    ID SERIAL PRIMARY KEY,
    name TEXT,
    handle TEXT,
    password TEXT
);

CREATE TABLE tweets ( 
    ID SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id INT NOT NULL REFERENCES users (ID),
    message VARCHAR(255)
);

INSERT INTO users (name, handle, password)
    VALUES 
        ('Santa', 'santaclaus', '1234'),
        ('Donald', 'trump', '4321');

INSERT INTO tweets (user_id, message)
    VALUES 
        (1, 'Hohoho! Merry Christmas!'),
        (1, 'fakenews'),
        (2, 'did i win?');




SELECT 
    tweets.id,
    tweets.message, 
    tweets.created_at,
    users.name,
    users.handle
    From 
    tweets
    inner join users on 
    tweets.user_id = users.id
    order by created_at DESC;
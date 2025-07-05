-- user table

CREATE TABLE IF NOT EXISTS user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- roadmap items

CREATE TABLE IF NOT EXISTS roadmap_item (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN('planned', 'in_progress', 'completed')),
    CATEGORY VARCHAR(50) NOT NULL,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT NOW()

)

--upvotes

CREATE TABLE IF NOT EXISTS upvotes(
    id SERIAL PRIMARY KEY,
    users_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    roadmap_item_id INTEGER NOT NULL REFERENCES roadmap_item(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, roadmap_item_id) --one upvote per user 
)

--comments
CREATE TABLE IF NOT EXISTS comment(
   id SERIAL PRIMARY KEY,
   users_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
   roadmap_item_id INTEGER NOT NULL REFERENCES roadmap_item(id) ON DELETE CASCADE,
   parent_comment_id INTEGER REFERENCES comment(id) ON DELETE CASCADE, -- for nested comments
   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()    
)

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, -- or UUID if you prefer
    role VARCHAR(50) NOT NULL, -- 'mother', 'father', 'health_worker'
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Mothers Table
CREATE TABLE IF NOT EXISTS mothers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    village VARCHAR(150),
    location VARCHAR(150),
    blood_group VARCHAR(10) DEFAULT 'Unknown',
    pre_existing_conditions TEXT,
    lmp_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_mother_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Create Fathers Table
CREATE TABLE IF NOT EXISTS fathers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    father_name VARCHAR(150) NOT NULL,
    wife_name VARCHAR(150) NOT NULL,
    wife_age INT NOT NULL,
    location VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_father_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Create Health Workers Table
CREATE TABLE IF NOT EXISTS health_workers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    anganwadi_location VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_worker_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE DATABASE IF NOT EXISTS flexiconnectdb;
USE flexiconnectdb;

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO role (role_name) VALUES ('ADMIN'), ('EMPLOYER'), ('CANDIDATE');

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    avatar VARCHAR(255),
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_role (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

CREATE TABLE verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('EMAIL', 'PHONE', 'DOCUMENT'),
    code VARCHAR(100),
    document_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    expired_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE candidate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    title VARCHAR(150),
    bio TEXT,
    bio_ai_suggestion TEXT,
    resume_file VARCHAR(255),
    profile_vector TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE employer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    tax_id VARCHAR(20) UNIQUE,
    website VARCHAR(100),
    address TEXT,
    company_intro TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE company_image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES employer(id) ON DELETE CASCADE
);

CREATE TABLE job_post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150),
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    job_type ENUM('PARTTIME', 'REMOTE', 'FREELANCE', 'INTERNSHIP'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at DATE,
    status ENUM('OPEN', 'CLOSED', 'HIDDEN') DEFAULT 'OPEN',
    view_count INT DEFAULT 0,
    job_vector TEXT,
    FOREIGN KEY (employer_id) REFERENCES employer(id) ON DELETE CASCADE
);

CREATE TABLE application (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_post_id INT,
    candidate_id INT,
    cover_letter TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'VIEWED', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
    rejection_reason TEXT,
    FOREIGN KEY (job_post_id) REFERENCES job_post(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE TABLE skill (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE candidate_skill (
    candidate_id INT,
    skill_id INT,
    level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    PRIMARY KEY (candidate_id, skill_id),
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(id) ON DELETE CASCADE
);

CREATE TABLE job_post_skill (
    job_post_id INT,
    skill_id INT,
    PRIMARY KEY (job_post_id, skill_id),
    FOREIGN KEY (job_post_id) REFERENCES job_post(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(id) ON DELETE CASCADE
);

CREATE TABLE education_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    school VARCHAR(100),
    major VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE TABLE work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    company VARCHAR(100),
    position VARCHAR(100),
    description TEXT,
    description_ai_suggestion TEXT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE TABLE follow_employer (
    candidate_id INT,
    employer_id INT,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (candidate_id, employer_id),
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    FOREIGN KEY (employer_id) REFERENCES employer(id) ON DELETE CASCADE
);

CREATE TABLE saved_job (
    candidate_id INT,
    job_post_id INT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (candidate_id, job_post_id),
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    FOREIGN KEY (job_post_id) REFERENCES job_post(id) ON DELETE CASCADE
);

CREATE TABLE rating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT,
    from_user_id INT,
    to_user_id INT,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES application(id) ON DELETE SET NULL,
    FOREIGN KEY (from_user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE interview_session (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    job_post_id INT,
    status ENUM('IN_PROGRESS', 'COMPLETED') DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    FOREIGN KEY (job_post_id) REFERENCES job_post(id) ON DELETE CASCADE
);

CREATE TABLE interview_turn (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    question TEXT,
    answer TEXT,
    ai_feedback TEXT,
    turn_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_session(id) ON DELETE CASCADE
);

CREATE TABLE package (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    duration_days INT,
    target_role ENUM('EMPLOYER', 'CANDIDATE') NOT NULL
);

CREATE TABLE payment_transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    package_id INT,
    amount DECIMAL(12, 2),
    transaction_code VARCHAR(100) UNIQUE,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES package(id)
);

CREATE TABLE user_package (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    package_id INT,
    transaction_id INT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES package(id),
    FOREIGN KEY (transaction_id) REFERENCES payment_transaction(id)
);

CREATE TABLE notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    type ENUM('JOB_NEW', 'APPLICATION_STATUS', 'SYSTEM_MESSAGE', 'CHAT_MESSAGE') DEFAULT 'SYSTEM_MESSAGE',
    link_to VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE conversation (
    id VARCHAR(100) PRIMARY KEY,
    user1_id INT,
    user2_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE(user1_id, user2_id)
);

CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action_type VARCHAR(100) NOT NULL,
    target_id INT,
    target_type VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
);

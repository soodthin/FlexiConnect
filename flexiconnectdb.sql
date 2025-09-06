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
    address VARCHAR(100),
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

CREATE TABLE candidate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    title VARCHAR(150),
    bio TEXT,
    resume_file VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE employer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    tax_code VARCHAR(20) UNIQUE,
    website VARCHAR(100),
    company_address TEXT,
    company_intro TEXT,
    follower INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    reason_reject VARCHAR(20),
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
    job_type ENUM('FULLTIME', 'PARTTIME', 'REMOTE', 'FREELANCE', 'INTERNSHIP'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at DATE,
    status ENUM('OPEN', 'CLOSED', 'HIDDEN') DEFAULT 'OPEN',
    view_count INT DEFAULT 0,
    FOREIGN KEY (employer_id) REFERENCES employer(id) ON DELETE CASCADE
);

CREATE TABLE application (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_post_id INT,
    candidate_id INT,
    cover_letter TEXT,
	resume_file VARCHAR(255),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
    rejection_reason TEXT,
    FOREIGN KEY (job_post_id) REFERENCES job_post(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE TABLE employer_email_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    employer_id INT NOT NULL,
    candidate_id INT NOT NULL,
    action_type ENUM(
        'INTERVIEW_INVITE',
        'INTERVIEW_RESULT',
        'REQUEST_DOCUMENTS',
        'OFFER_LETTER',
        'INTERVIEW_CANCEL'
    ) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES application(id) ON DELETE CASCADE,
    FOREIGN KEY (employer_id) REFERENCES employer(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE TABLE skill (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL COLLATE utf8mb4_unicode_ci 
);


CREATE TABLE candidate_skill (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    skill_id INT NOT NULL,
    level VARCHAR(50) NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(id) ON DELETE CASCADE,
    UNIQUE (candidate_id, skill_id)
);


CREATE TABLE education_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    school VARCHAR(50),
    major VARCHAR(50),
    degree VARCHAR(50),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);

CREATE TABLE work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT,
    company VARCHAR(100),
    position VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);


CREATE TABLE cv_suggestion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    section ENUM('INTRODUCTION', 'SKILLS', 'EXPERIENCE') NOT NULL,
    original_input TEXT NOT NULL,
    ai_suggestion TEXT NOT NULL,
    edited_version TEXT,
    status ENUM('SUGGESTED', 'EDITED', 'SUBMITTED') DEFAULT 'SUGGESTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidate(id) ON DELETE CASCADE
);
CREATE TABLE follow_employer (
    candidate_id INT,
    employer_id INT,
    notify_job BOOLEAN DEFAULT TRUE,
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
    ai_score double CHECK (ai_score BETWEEN 0 AND 100),
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

INSERT INTO package (name, description, price, duration_days, target_role) VALUES
('Basic', 'Chức năng AI cơ bản', 55000, 30, 'CANDIDATE'),
('Premium', 'Chức năng AI nâng cao', 115000, 30, 'CANDIDATE');

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
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type ENUM('JOB_NEW', 'APPLICATION_STATUS', 'SYSTEM_MESSAGE', 'CHAT_MESSAGE') DEFAULT 'SYSTEM_MESSAGE',
    link_to VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_id INT NOT NULL,
    user_id INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (notification_id) REFERENCES notification(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE(notification_id, user_id)
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


CREATE DATABASE IF NOT EXISTS formics
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE formics;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_users PRIMARY KEY (id),
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT chk_users_username CHECK (CHAR_LENGTH(TRIM(username)) >= 2)
);

CREATE TABLE IF NOT EXISTS templates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  topic VARCHAR(100) NOT NULL,
  image VARCHAR(255) NULL,
  tags VARCHAR(255) NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_templates PRIMARY KEY (id),
  CONSTRAINT fk_templates_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE,
  CONSTRAINT chk_templates_title CHECK (CHAR_LENGTH(TRIM(title)) >= 3),
  CONSTRAINT chk_templates_topic CHECK (CHAR_LENGTH(TRIM(topic)) >= 2)
);

CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_topic ON templates(topic);
CREATE INDEX idx_templates_is_public ON templates(is_public);

CREATE TABLE IF NOT EXISTS questions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  template_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  `order` INT UNSIGNED NOT NULL DEFAULT 0,
  show_in_table BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_questions PRIMARY KEY (id),
  CONSTRAINT fk_questions_template
    FOREIGN KEY (template_id) REFERENCES templates(id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE,
  CONSTRAINT chk_questions_title CHECK (CHAR_LENGTH(TRIM(title)) >= 2),
  CONSTRAINT chk_questions_type CHECK (
    type IN ('text', 'textarea', 'number', 'checkbox', 'single-line', 'multi-line', 'integer')
  )
);

CREATE INDEX idx_questions_template_id ON questions(template_id);
CREATE INDEX idx_questions_template_order ON questions(template_id, `order`);

CREATE TABLE IF NOT EXISTS responses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  template_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_responses PRIMARY KEY (id),
  CONSTRAINT fk_responses_template
    FOREIGN KEY (template_id) REFERENCES templates(id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE,
  CONSTRAINT fk_responses_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE
);

CREATE INDEX idx_responses_template_id ON responses(template_id);
CREATE INDEX idx_responses_user_id ON responses(user_id);
CREATE INDEX idx_responses_created_at ON responses(created_at);

CREATE TABLE IF NOT EXISTS answers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  response_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_answers PRIMARY KEY (id),
  CONSTRAINT fk_answers_response
    FOREIGN KEY (response_id) REFERENCES responses(id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE,
  CONSTRAINT fk_answers_question
    FOREIGN KEY (question_id) REFERENCES questions(id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE,
  CONSTRAINT uq_answers_response_question UNIQUE (response_id, question_id)
);

CREATE INDEX idx_answers_response_id ON answers(response_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

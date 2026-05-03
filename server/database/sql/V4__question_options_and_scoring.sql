USE formics;

SET @has_options_column = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'questions'
    AND COLUMN_NAME = 'options'
);
SET @ddl = IF(
  @has_options_column = 0,
  'ALTER TABLE questions ADD COLUMN options JSON NULL AFTER type',
  'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_correct_answer_column = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'questions'
    AND COLUMN_NAME = 'correct_answer'
);
SET @ddl = IF(
  @has_correct_answer_column = 0,
  'ALTER TABLE questions ADD COLUMN correct_answer TEXT NULL AFTER options',
  'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE questions
  DROP CHECK chk_questions_type;

ALTER TABLE questions
  ADD CONSTRAINT chk_questions_type CHECK (
    type IN ('text', 'textarea', 'number', 'checkbox', 'single-line', 'multi-line', 'integer', 'single-choice', 'multiple-choice')
  );

USE formics;

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS options JSON NULL AFTER type,
  ADD COLUMN IF NOT EXISTS correct_answer TEXT NULL AFTER options;

ALTER TABLE questions
  DROP CHECK chk_questions_type;

ALTER TABLE questions
  ADD CONSTRAINT chk_questions_type CHECK (
    type IN ('text', 'textarea', 'number', 'checkbox', 'single-line', 'multi-line', 'integer', 'single-choice', 'multiple-choice')
  );

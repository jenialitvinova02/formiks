USE formics;

INSERT INTO users (username, email, password, role)
VALUES
  ('Local Admin', 'admin@local.test', '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcd', 'admin'),
  ('Demo User', 'demo@local.test', '$2b$10$abcdefghijklmnopqrstuvabcdefghijklmnopqrstuvabcd', 'user')
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO templates (user_id, title, description, topic, tags, is_public)
SELECT u.id,
       'Local Feedback Form',
       'Demo template for local development and manual testing.',
       'feedback',
       'demo,local,feedback',
       TRUE
FROM users u
WHERE u.email = 'demo@local.test'
  AND NOT EXISTS (
    SELECT 1 FROM templates t WHERE t.title = 'Local Feedback Form'
  );

INSERT INTO questions (template_id, title, description, type, `order`, show_in_table)
SELECT t.id, q.title, q.description, q.type, q.ord, TRUE
FROM templates t
JOIN (
  SELECT 'Your name' AS title, 'Short text field' AS description, 'text' AS type, 1 AS ord
  UNION ALL
  SELECT 'How satisfied are you from 1 to 10?', 'Numeric field', 'number', 2
  UNION ALL
  SELECT 'Would you recommend this app?', 'Checkbox field', 'checkbox', 3
) q
WHERE t.title = 'Local Feedback Form'
  AND NOT EXISTS (
    SELECT 1 FROM questions existing WHERE existing.template_id = t.id
  );

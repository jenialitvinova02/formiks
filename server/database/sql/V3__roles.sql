CREATE ROLE IF NOT EXISTS 'app_read';
CREATE ROLE IF NOT EXISTS 'app_write';
CREATE ROLE IF NOT EXISTS 'admin';

GRANT SELECT ON formics.* TO 'app_read';

GRANT SELECT, INSERT, UPDATE, DELETE ON formics.* TO 'app_write';

GRANT ALL PRIVILEGES ON formics.* TO 'admin';

CREATE USER IF NOT EXISTS 'formics_read'@'%' IDENTIFIED BY 'change_me_read';
CREATE USER IF NOT EXISTS 'formics_write'@'%' IDENTIFIED BY 'change_me_write';
CREATE USER IF NOT EXISTS 'formics_admin'@'%' IDENTIFIED BY 'change_me_admin';

GRANT 'app_read' TO 'formics_read'@'%';
GRANT 'app_write' TO 'formics_write'@'%';
GRANT 'admin' TO 'formics_admin'@'%';

SET DEFAULT ROLE 'app_read' TO 'formics_read'@'%';
SET DEFAULT ROLE 'app_write' TO 'formics_write'@'%';
SET DEFAULT ROLE 'admin' TO 'formics_admin'@'%';

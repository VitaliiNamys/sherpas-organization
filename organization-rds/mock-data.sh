#!/bin/bash

# MySQL Connection Details
MYSQL_USER="root"
MYSQL_PASSWORD=""
MYSQL_DATABASE="organizations"
MYSQL_HOST="127.0.0.1"

# Insert Mock Data into Organizations table
mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -h"$MYSQL_HOST" "$MYSQL_DATABASE" <<EOF
INSERT INTO Organizations (SOID, Name, Created, Updated, Status)
VALUES
  ('1', 'Organization A', NOW(), NOW(), 'Active'),
  ('2', 'Organization B', NOW(), NOW(), 'Pending'),
  ('3', 'Organization C', NOW(), NOW(), 'Active');

-- Insert Mock Data into Teams table
INSERT INTO Teams (STID, SOID, IntegrationID, Name, Created, Updated, Status)
VALUES
  ('101', '1', 'IntegrationID_101', 'Team X', NOW(), NOW(), 'Active'),
  ('102', '1', 'IntegrationID_102', 'Team Y', NOW(), NOW(), 'Pending'),
  ('103', '2', 'IntegrationID_103', 'Team Z', NOW(), NOW(), 'Active');

-- Insert Mock Data into Contributors table
INSERT INTO Contributors (SCID, STID, Name, Email, Created, Updated, Role, Status)
VALUES
  ('1001', '101', 'John Doe', 'john@example.com', NOW(), NOW(), 'Admin', 'Active'),
  ('1002', '101', 'Jane Doe', 'jane@example.com', NOW(), NOW(), 'Contributor', 'Pending'),
  ('1003', '102', 'Bob Smith', 'bob@example.com', NOW(), NOW(), 'Viewer', 'Active');
EOF
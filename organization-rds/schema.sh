#!/bin/bash

# MySQL Connection Details
MYSQL_USER="root"
MYSQL_PASSWORD=""
MYSQL_DATABASE="organizations"
MYSQL_HOST="127.0.0.1"

# Execute SQL Statements
mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -h"$MYSQL_HOST" "$MYSQL_DATABASE" <<EOF

CREATE TABLE IF NOT EXISTS Organizations (
    SOID VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Created DATETIME,
    Updated DATETIME,
    Status ENUM('Pending', 'Active', 'Inactive', 'Deleted') NOT NULL
);

CREATE TABLE IF NOT EXISTS Teams (
    STID VARCHAR(255) PRIMARY KEY,
    SOID VARCHAR(255) NOT NULL,
    IntegrationID VARCHAR(255) NOT NULL, 
    Name VARCHAR(255) NOT NULL,
    Created DATETIME,
    Updated DATETIME,
    Status ENUM('Pending', 'Active', 'Inactive', 'Deleted') NOT NULL,
    FOREIGN KEY (SOID) REFERENCES Organizations(SOID)
);

CREATE TABLE IF NOT EXISTS Contributors (
    SCID VARCHAR(255) PRIMARY KEY,
    STID VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Created DATETIME,
    Updated DATETIME,
    Role ENUM('Admin', 'Contributor', 'Viewer') NOT NULL,
    Status ENUM('Pending', 'Active', 'Inactive', 'Deleted') NOT NULL,
    FOREIGN KEY (STID) REFERENCES Teams(STID)
);
EOF

#!/bin/bash

# Script untuk membuat database PostgreSQL
# Usage: ./scripts/create-database.sh

DB_NAME=${DB_DATABASE:-employee_management}
DB_USER=${DB_USERNAME:-postgres}

echo "Creating database: $DB_NAME"

# Cek apakah database sudah ada
if psql -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Database $DB_NAME already exists"
else
    # Buat database
    createdb -U $DB_USER $DB_NAME
    echo "Database $DB_NAME created successfully"
fi


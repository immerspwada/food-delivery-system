#!/bin/bash

# Connection string from the project
CONNECTION_STRING="postgresql://postgres.bsyernhbtlqwiilkiuig:Luckybear2024@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

echo "Executing SQL script..."
psql "$CONNECTION_STRING" -f /Users/luckybear/wwdelive/fix-enum-final.sql

echo "SQL execution completed."
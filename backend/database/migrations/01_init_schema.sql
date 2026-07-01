-- Migration: Initialize schema and tables for SmartFinGuard database

-- 1. Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create loan_profiles table if not exists
CREATE TABLE IF NOT EXISTS loan_profiles (
    profile_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NULL,
    amount_requested NUMERIC(15, 2) NULL,
    status VARCHAR(100) DEFAULT 'Chờ xử lý',
    risk_color VARCHAR(50) DEFAULT 'green',
    ai_risk_score INT DEFAULT 0,
    invoice_url TEXT NULL,
    tax_code VARCHAR(100) NULL,
    invoice_no VARCHAR(100) NULL,
    file_hash VARCHAR(100) NULL,
    details TEXT NULL,
    ket_luan VARCHAR(200) NULL,
    do_tin_cay INT NULL,
    logic_so_hoc TEXT NULL,
    do_tin_cay_tong_the TEXT NULL,
    khuyen_nghi TEXT NULL,
    ela_mask_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all new forensic columns exist (in case the table existed before)
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS tax_code VARCHAR(100) NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS invoice_no VARCHAR(100) NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS file_hash VARCHAR(100) NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS details TEXT NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS ket_luan VARCHAR(200) NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS do_tin_cay INT NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS logic_so_hoc TEXT NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS do_tin_cay_tong_the TEXT NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS khuyen_nghi TEXT NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS invoice_url TEXT NULL;
ALTER TABLE loan_profiles ADD COLUMN IF NOT EXISTS ela_mask_url TEXT NULL;

-- 3. Create ai_bounding_boxes table if not exists
CREATE TABLE IF NOT EXISTS ai_bounding_boxes (
    box_id SERIAL PRIMARY KEY,
    profile_id INT REFERENCES loan_profiles(profile_id) ON DELETE CASCADE,
    x_min INT NOT NULL,
    y_min INT NOT NULL,
    x_max INT NOT NULL,
    y_max INT NOT NULL,
    issue_description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create assistant_chat_logs table if not exists
CREATE TABLE IF NOT EXISTS assistant_chat_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT NULL,
    message TEXT NOT NULL,
    reply TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

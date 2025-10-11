# Database Connection Guide

## Your Database Credentials
- **Host:** dpg-d17rkfbuibrs73824u30-a.singapore-postgres.render.com
- **Port:** 5432
- **Database:** blinkeach
- **Username:** blinkeach_user
- **Password:** buXVCCmbJyeQbnUcVjYuAVVt094hUSCN

## Connection String
```
postgresql://blinkeach_user:buXVCCmbJyeQbnUcVjYuAVVt094hUSCN@dpg-d17rkfbuibrs73824u30-a.singapore-postgres.render.com/blinkeach?sslmode=require
```

---

## pgAdmin 4 Configuration

### Connection Tab:
- **Host name/address:** `dpg-d17rkfbuibrs73824u30-a.singapore-postgres.render.com`
- **Port:** `5432`
- **Maintenance database:** `blinkeach`
- **Username:** `blinkeach_user`
- **Password:** `buXVCCmbJyeQbnUcVjYuAVVt094hUSCN`
- ✓ **Save password**

### SSL Tab (Try each option):
**Option 1 (Try this first):**
- **SSL mode:** `Prefer`

**Option 2 (If Option 1 fails):**
- **SSL mode:** `Allow`

**Option 3 (If both fail):**
- **SSL mode:** `Disable`
- Note: This is less secure but may work for development

### Advanced Tab:
- **DB restriction:** `blinkeach`

---

## Alternative: DBeaver (Better for Render databases)

1. Download DBeaver: https://dbeaver.io/download/
2. Create New Connection → PostgreSQL
3. Enter:
   - **Host:** dpg-d17rkfbuibrs73824u30-a.singapore-postgres.render.com
   - **Port:** 5432
   - **Database:** blinkeach
   - **Username:** blinkeach_user
   - **Password:** buXVCCmbJyeQbnUcVjYuAVVt094hUSCN
4. Go to **SSL tab**:
   - **SSL mode:** require
   - **SSL Factory:** org.postgresql.ssl.NonValidatingFactory
5. Click "Test Connection"

---

## Alternative: TablePlus (Modern & User-Friendly)

1. Download TablePlus: https://tableplus.com/
2. Create New Connection → PostgreSQL
3. Enter the credentials above
4. Enable SSL
5. Connect

---

## Alternative: Use VS Code Extension

Install "PostgreSQL" extension by Chris Kolkman:
1. Open VS Code
2. Install extension: `PostgreSQL` by Chris Kolkman
3. Add connection with your credentials
4. SSL mode: prefer

---

## Troubleshooting pgAdmin

### If connection keeps failing:

1. **Clear pgAdmin cache:**
   - Close pgAdmin
   - Delete: `%APPDATA%\pgAdmin\`
   - Restart pgAdmin

2. **Update pgAdmin:**
   - Download latest version from https://www.pgadmin.org/download/

3. **Check Render Dashboard:**
   - Go to https://dashboard.render.com
   - Check if your database is active (not suspended)
   - Free tier databases may sleep after inactivity

4. **Wake up the database:**
   - Run your Node.js app first (npm run dev)
   - This will wake up the database
   - Then try connecting with pgAdmin

---

## Quick Test via Node.js

Run this command to test the connection:
```bash
node test-db-connection.js
```

This will verify if the database is accessible.
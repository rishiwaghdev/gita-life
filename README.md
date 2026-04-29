# Gita Life Program

## Telegram Integration Setup & Test

### 1. Get your Telegram Chat ID
- Open Telegram app/web
- Message [@userinfobot](https://t.me/userinfobot)
- Send `/start` → Copy your **Id** (e.g. 123456789)

### 2. Update .env
```
cd backend
code .env  # or edit manually
```
Add:
```
TELEGRAM_DEFAULT_CHAT_ID=your_chat_id_here  # Paste from step 1
```
*(Bot token already set)*

### 3. Start Backend
```
cd backend
npm run dev
```
Server: http://localhost:5000  
Cron starts automatically at 8AM daily.

### 4. Quick Test (Temporary)
**Stop server** (Ctrl+C), run every minute:
```
node -e "require('./src/services/cron.service').startCronJobs()"
```
*(Change back cron.schedule to '0 8 * * *' after testing)*

### 5. Add Test Data
Via frontend Dashboard → Students/Batches/Sessions:
- Student: phone = your chat ID from step 1, any email/name
- Batch with student
- Tomorrow's session in that batch

### 6. Verify
- Check server console: "Reminder telegram sent to..."
- Message appears in **your** Telegram chat

### 7. Production
Deploy to Vercel: Cron works serverlessly. Set env vars in Vercel dashboard.

**Note:** Uses phone as chatId for students (common). Works if phone matches Telegram ID. No frontend changes needed.

Enjoy Gita Life Telegram reminders! 🙏


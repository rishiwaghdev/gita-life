const cron = require('node-cron');
const prisma = require('../prisma/client');
const { sendMessage } = require('./telegram.service');

// Schedule job to run every day at 8:00 AM
const startCronJobs = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily email reminder cron job...');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
      const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

      const upcomingSessions = await prisma.session.findMany({
        where: {
          date: {
            gte: startOfTomorrow,
            lte: endOfTomorrow,
          },
        },
        include: {
          batch: {
            include: {
              students: true,
            },
          },
        },
      });

      for (const session of upcomingSessions) {
        if (!session.batch || !session.batch.students) continue;

        for (const student of session.batch.students) {
          if (student.email) {
            const sessionTime = session.time || 'your scheduled time';
            const reminderMessage = `Hello ${student.name} 🙏

Your Gita Life session is scheduled for tomorrow at ${sessionTime}.

Every session is a step forward in your journey of learning and self-growth. Try to attend regularly and stay consistent — it truly makes a difference.

We look forward to your presence. See you tomorrow!`;
            await sendMessage({
              chatId: student.phone,
              text: reminderMessage,
            });
            console.log(`Reminder telegram sent to ${student.name} (${student.phone}) for session: ${session.title || session.date}`);
          }
        }
      }
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
  console.log('Cron jobs initialized.');
};

module.exports = { startCronJobs };

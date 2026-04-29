const prisma = require('../prisma/client');
const telegramService = require('../services/telegram.service');

const createLead = async (req, res) => {
  try {
    const { name, phone, email, location, college } = req.body;
    
    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'Name, phone and email are required' });
    }

    const lead = await prisma.lead.create({
      data: { name, phone, email, location, college }
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeadCount = async (req, res) => {
  try {
    const count = await prisma.lead.count();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const convertLead = async (req, res) => {
  try {
    const { id } = req.params;
    const batchId = req.body?.batchId;

    const lead = await prisma.lead.findUnique({ where: { id: parseInt(id) } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (lead.status === 'CONVERTED') return res.status(400).json({ message: 'Lead already converted' });

    // Use a transaction
    const [updatedLead, student] = await prisma.$transaction([
      prisma.lead.update({
        where: { id: parseInt(id) },
        data: { status: 'CONVERTED' }
      }),
      prisma.student.create({
        data: {
          leadId: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          location: lead.location,
          college: lead.college,
          batchId: batchId || null
        }
      })
    ]);

    res.json({ message: 'Lead converted successfully', student });
  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const sendThankYouMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { chatId, message, sessionTime } = req.body;

    const lead = await prisma.lead.findUnique({ where: { id: parseInt(id) } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    const resolvedSessionTime = sessionTime || 'your scheduled time';
    const telegramMessage = message || `Hello ${lead.name} 🙏

Your Gita Life session is scheduled for tomorrow at ${resolvedSessionTime}.

Every session is a step forward in your journey of learning and self-growth. Try to attend regularly and stay consistent - it truly makes a difference.

We look forward to your presence. See you tomorrow!`;

    await telegramService.sendMessage({
      chatId,
      text: telegramMessage,
    });

    res.json({ message: 'Telegram message sent successfully' });
  } catch (error) {
    const telegramError = error.response?.data?.description || error.message;
    console.error('Send Telegram message error:', error.response?.data || error);
    res.status(500).json({ message: 'Telegram error: ' + telegramError });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({ where: { id: parseInt(id) } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Delete the lead (cascading delete will handle related records)
    const deletedLead = await prisma.lead.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Lead deleted successfully', deletedLead });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { createLead, getLeads, getLeadCount, convertLead, sendThankYouMessage, deleteLead };

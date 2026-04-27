const prisma = require('../prisma/client');
const emailService = require('../services/email.service');

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
    const { message, subject, sessionTime } = req.body;

    const lead = await prisma.lead.findUnique({ where: { id: parseInt(id) } });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (!lead.email) return res.status(400).json({ message: 'Lead has no email address' });

    const resolvedSessionTime = sessionTime || 'your scheduled time';
    const emailSubject = subject || 'Gita Life Session Reminder';
    const emailBody = message || `Hello ${lead.name} 🙏

Your Gita Life session is scheduled for tomorrow at ${resolvedSessionTime}.

Every session is a step forward in your journey of learning and self-growth. Try to attend regularly and stay consistent — it truly makes a difference.

We look forward to your presence. See you tomorrow!`;
    await emailService.sendEmail({
      to: lead.email,
      subject: emailSubject,
      text: emailBody,
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
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

const prisma = require('../prisma/client');

const createSession = async (req, res) => {
  try {
    const { batchId, title, date, time } = req.body;
    
    if (!batchId || !date || !time) {
      return res.status(400).json({ message: 'Batch ID, date, and time are required' });
    }

    const session = await prisma.session.create({
      data: {
        batchId: parseInt(batchId),
        title,
        date: new Date(date),
        time
      }
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSessionsByBatch = async (req, res) => {
  try {
    const { batchId } = req.query;
    if (!batchId) return res.status(400).json({ message: 'Batch ID is required' });

    const sessions = await prisma.session.findMany({
      where: { batchId: parseInt(batchId) },
      orderBy: { date: 'asc' }
    });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createSession, getSessionsByBatch };

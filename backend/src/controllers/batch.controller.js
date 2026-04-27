const prisma = require('../prisma/client');

const createBatch = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Batch name is required' });

    const batch = await prisma.batch.create({ data: { name } });
    res.status(201).json(batch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBatches = async (req, res) => {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        _count: {
          select: { students: true, sessions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(batches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBatchCount = async (req, res) => {
  try {
    const count = await prisma.batch.count();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await prisma.batch.findUnique({
      where: { id: parseInt(id) },
      include: {
        students: true,
        sessions: {
          orderBy: { date: 'asc' }
        }
      }
    });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json(batch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await prisma.batch.findUnique({ where: { id: parseInt(id) } });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    // Delete the batch (cascading delete will handle related records)
    const deletedBatch = await prisma.batch.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Batch deleted successfully', deletedBatch });
  } catch (error) {
    console.error('Delete batch error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { createBatch, getBatches, getBatchCount, getBatchById, deleteBatch };

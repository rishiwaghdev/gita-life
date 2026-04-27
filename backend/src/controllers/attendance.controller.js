const prisma = require('../prisma/client');

const markAttendance = async (req, res) => {
  try {
    const { sessionId, studentId, status } = req.body;
    
    if (!sessionId || !studentId || !status) {
      return res.status(400).json({ message: 'Session ID, Student ID, and status are required' });
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        sessionId_studentId: {
          sessionId: parseInt(sessionId),
          studentId: parseInt(studentId)
        }
      },
      update: { status },
      create: {
        sessionId: parseInt(sessionId),
        studentId: parseInt(studentId),
        status
      }
    });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const attendanceRecords = await prisma.attendance.findMany({
      where: { sessionId: parseInt(sessionId) },
      include: { student: true }
    });

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { markAttendance, getSessionAttendance };

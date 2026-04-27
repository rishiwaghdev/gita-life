const prisma = require('../prisma/client');

const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        batch: true,
        attendance: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Add attendance summary
    const formattedStudents = students.map(student => {
      const presentCount = student.attendance.filter(a => a.status === 'PRESENT').length;
      const totalCount = student.attendance.length;
      return {
        ...student,
        attendanceSummary: `${presentCount}/${totalCount}`,
        attendancePercentage: totalCount ? ((presentCount / totalCount) * 100).toFixed(2) : 0
      };
    });

    res.json(formattedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentCount = async (req, res) => {
  try {
    const count = await prisma.student.count();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await prisma.attendance.findMany({
      where: { studentId: parseInt(id) },
      include: {
        session: true
      },
      orderBy: { session: { date: 'asc' } }
    });
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudentBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { batchId } = req.body;
    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: { batchId: parseInt(batchId) }
    });
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = parseInt(id);

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Ensure dependent attendance rows are removed before deleting student.
    const [, deletedStudent] = await prisma.$transaction([
      prisma.attendance.deleteMany({
        where: { studentId }
      }),
      prisma.student.delete({
        where: { id: studentId }
      })
    ]);

    res.json({ message: 'Student deleted successfully', deletedStudent });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { getStudents, getStudentCount, getStudentAttendance, updateStudentBatch, deleteStudent };

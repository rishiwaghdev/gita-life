import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchData = async () => {
    try {
      const [studentsRes, batchesRes] = await Promise.all([
        api.get('/students'),
        api.get('/batches')
      ]);
      setStudents(studentsRes.data);
      setSelectedStudent((currentStudent) => {
        if (!currentStudent) return currentStudent;
        return studentsRes.data.find((student) => student.id === currentStudent.id) || null;
      });
      setBatches(batchesRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch attendance data for selected student
  useEffect(() => {
    if (selectedStudent) {
      fetchAttendanceData(selectedStudent.id);
    }
  }, [selectedStudent]);

  const fetchAttendanceData = async (studentId) => {
    try {
      const res = await api.get(`/students/${studentId}/attendance`);
      // Transform data for graph
      const formattedData = res.data.map(record => ({
        date: new Date(record.session?.date || record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: record.status === 'PRESENT' ? 1 : 0,
        status: record.status === 'PRESENT' ? 'Present' : 'Absent'
      }));
      setAttendanceData(formattedData);
    } catch (error) {
      console.error('Failed to fetch attendance data', error);
      setAttendanceData([]);
    }
  };

  const handleAssignBatch = async (studentId, batchId) => {
    if (!batchId) return;
    try {
      await api.patch(`/students/${studentId}/batch`, { batchId });
      fetchData(); // Refresh list
    } catch (error) {
      alert('Failed to assign batch');
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student "${studentName}"?`)) return;
    try {
      await api.delete(`/students/${studentId}`);
      alert('Student deleted successfully!');
      setSelectedStudent(null);
      fetchData();
    } catch (error) {
      alert('Failed to delete student: ' + (error.response?.data?.message || error.message));
    }
  };

  // Calculate attendance stats
  const calculateStats = (data) => {
    const total = data.length;
    const present = data.filter(d => d.present === 1).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percentage };
  };

  const stats = selectedStudent && attendanceData.length > 0 ? calculateStats(attendanceData) : null;

  const pieData = stats ? [
    { name: 'Present', value: stats.present, color: '#10b981' },
    { name: 'Absent', value: stats.absent, color: '#ef4444' }
  ] : [];

  const COLORS = ['#10b981', '#ef4444'];

  const getProgressTone = (value) => {
    if (value >= 75) return 'from-emerald-500 to-teal-500';
    if (value >= 40) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-orange-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-700 sm:text-3xl">Students Management</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Students List */}
        <div className="xl:col-span-2">
        <div className="devotional-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-left text-sm devotional-table">
            <thead className="border-b border-[#ead3ad]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">College</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center devotional-muted">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center devotional-muted">No students found.</td></tr>
              ) : students.map(student => (
                <tr 
                  key={student.id} 
                  className={`border-b border-[#f0e3cf] transition-colors cursor-pointer ${selectedStudent?.id === student.id ? 'bg-[#fff0d8]' : 'hover:bg-[#fffdf7]'}`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="px-6 py-4 font-medium text-[#3b2719]">{student.name}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{student.phone}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{student.college || '-'}</td>
                  <td className="px-6 py-4 text-[#5e4738]">
                    <select
                      className="border border-[#dfc7a2] rounded-md text-sm p-1.5 bg-[#fffdf7] text-[#5e4738] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      value={student.batchId || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleAssignBatch(student.id, e.target.value);
                      }}
                    >
                      <option value="">Assign...</option>
                      {batches.map(batch => (
                        <option key={batch.id} value={batch.id}>{batch.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-[#5e4738]">
                    <div className="min-w-[160px]">
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#8f6d4a]">
                        <span>Course Progress</span>
                        <span>{Math.round(student.batchProgress || 0)}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-[#eadfcd]">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getProgressTone(student.batchProgress || 0)} transition-all duration-500`}
                          style={{ width: `${student.batchProgress || 0}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-[#7b614f]">
                        {student.attendedSessions || 0} of {student.totalSessions || 0} sessions completed
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudent(student.id, student.name);
                      }}
                      className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        </div>

        {/* Attendance Progress Panel */}
        {selectedStudent && (
          <div className="xl:col-span-1">
            <div className="devotional-panel p-5 sm:p-6 xl:sticky xl:top-6">
              <h2 className="mb-4 text-xl font-bold text-primary-700 sm:text-2xl">{selectedStudent.name}</h2>
              <p className="text-sm text-[#7b614f] mb-6">Phone: {selectedStudent.phone}</p>

              <div className="mb-6 overflow-hidden rounded-2xl border border-[#edd9b7] bg-[#fff8ea] p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f6d4a]">Learning Progress</p>
                    <p className="mt-2 text-4xl font-bold text-primary-700">{Math.round(selectedStudent.batchProgress || 0)}%</p>
                    <p className="mt-1 text-sm text-[#7b614f]">
                      {selectedStudent.attendedSessions || 0} of {selectedStudent.totalSessions || 0} batch sessions attended
                    </p>
                  </div>
                  <div className="rounded-full border border-[#eed6ab] bg-white px-3 py-1 text-xs font-semibold text-[#8f6d4a]">
                    {attendanceData.length} attendance records
                  </div>
                </div>
                <div className="mt-4 h-4 overflow-hidden rounded-full bg-[#eadfcd] shadow-inner">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getProgressTone(selectedStudent.batchProgress || 0)} transition-all duration-500`}
                    style={{ width: `${selectedStudent.batchProgress || 0}%` }}
                  />
                </div>
              </div>

              {attendanceData.length === 0 ? (
                <p className="devotional-muted text-center py-8">No attendance records yet</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 font-medium">Present</p>
                      <p className="text-2xl font-bold text-green-700">{stats.present}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                      <p className="text-xs text-red-700 font-medium">Absent</p>
                      <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700 font-medium">Attendance Rate</p>
                      <p className="text-3xl font-bold text-blue-700">{stats.percentage}%</p>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-100 p-4 rounded-lg border border-amber-200">
                      <p className="text-xs text-[#9a551a] font-medium">Batch Progress</p>
                      <p className="text-3xl font-bold text-[#9a551a]">{Math.round(selectedStudent.batchProgress || 0)}%</p>
                      <p className="mt-1 text-xs text-[#9a551a]">
                        {selectedStudent.attendedSessions || 0}/{selectedStudent.totalSessions || 0} sessions
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-[#3b2719] mb-4">Attendance Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#3b2719] mb-4">Attendance Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={attendanceData.slice(-10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="present" fill="#10b981" name="Present" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [studentsRes, batchesRes] = await Promise.all([
        api.get('/students'),
        api.get('/batches')
      ]);
      setStudents(studentsRes.data);
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
      fetchData();
    } catch (error) {
      alert('Failed to delete student: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-700">Students Management</h1>
      </div>

      <div className="devotional-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left devotional-table">
            <thead className="border-b border-[#ead3ad]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">College</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center devotional-muted">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center devotional-muted">No students found.</td></tr>
              ) : students.map(student => (
                <tr key={student.id} className="border-b border-[#f0e3cf] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#3b2719]">{student.name}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{student.phone}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{student.college || '-'}</td>
                  <td className="px-6 py-4 text-[#5e4738]">
                    <span className="font-semibold">{student.attendanceSummary}</span>
                    {student.attendancePercentage > 0 && <span className="text-xs ml-1 text-[#8f6d4a]">({student.attendancePercentage}%)</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-3 justify-end">
                      <select
                        className="border border-[#dfc7a2] rounded-md text-sm p-1.5 bg-[#fffdf7] text-[#5e4738] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        value={student.batchId || ''}
                        onChange={(e) => handleAssignBatch(student.id, e.target.value)}
                      >
                        <option value="">Assign Batch...</option>
                        {batches.map(batch => (
                          <option key={batch.id} value={batch.id}>{batch.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;

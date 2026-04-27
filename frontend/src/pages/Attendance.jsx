import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Check, X } from 'lucide-react';

const Attendance = () => {
  const { sessionId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { studentId: 'PRESENT' | 'ABSENT' }
  const [loading, setLoading] = useState(true);

  // We need to fetch the session details to know which batch it belongs to, 
  // then fetch students in that batch, and map existing attendance.
  // For simplicity here, let's fetch students of the batch, and the current attendance records for the session.

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Fetch session attendance records
        const attRes = await api.get(`/attendance/session/${sessionId}`);
        const records = attRes.data;
        
        const map = {};
        records.forEach(r => {
          map[r.studentId] = r.status;
        });
        setAttendanceMap(map);

        // Fetch all students (in a real app, you'd fetch only students for the specific batch)
        const stdRes = await api.get('/students');
        // Filter out those who don't have a batch assigned (or you'd fetch based on session.batchId)
        // Here we just display all students for now, but ideally we get session details first.
        setStudents(stdRes.data);

      } catch (error) {
        console.error('Failed to load attendance', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, [sessionId]);

  const markStatus = async (studentId, status) => {
    try {
      await api.post('/attendance', {
        sessionId,
        studentId,
        status
      });
      setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    } catch (error) {
      alert('Failed to mark attendance');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard/batches" className="text-[#7b614f] hover:text-[#3b2719]">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-primary-700">Mark Attendance</h1>
      </div>

      <div className="devotional-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left devotional-table">
            <thead className="border-b border-[#ead3ad]">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="px-6 py-8 text-center devotional-muted">Loading...</td></tr>
              ) : students.map(student => {
                const status = attendanceMap[student.id];
                return (
                  <tr key={student.id} className="border-b border-[#f0e3cf] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#3b2719]">{student.name}</td>
                    <td className="px-6 py-4 text-center">
                      {status ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          status === 'PRESENT' ? 'bg-[#e7f6df] text-[#2f6415]' : 'bg-[#fee8e8] text-[#9f2b2b]'
                        }`}>
                          {status}
                        </span>
                      ) : (
                        <span className="text-[#8f6d4a] text-xs italic">Not Marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => markStatus(student.id, 'PRESENT')}
                          className={`p-2 rounded-full transition-colors ${
                            status === 'PRESENT' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                          title="Mark Present"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => markStatus(student.id, 'ABSENT')}
                          className={`p-2 rounded-full transition-colors ${
                            status === 'ABSENT' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                          title="Mark Absent"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

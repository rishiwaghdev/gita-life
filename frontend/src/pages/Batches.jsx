import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBatchName, setNewBatchName] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [sessions, setSessions] = useState([]);
  
  // New session state
  const [newSession, setNewSession] = useState({ title: '', date: '', time: '' });

  const fetchBatches = async () => {
    try {
      const res = await api.get('/batches');
      setBatches(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!newBatchName) return;
    try {
      await api.post('/batches', { name: newBatchName });
      setNewBatchName('');
      fetchBatches();
    } catch (error) {
      alert('Failed to create batch');
    }
  };

  const loadSessions = async (batchId) => {
    setSelectedBatchId(batchId);
    try {
      const res = await api.get(`/sessions?batchId=${batchId}`);
      setSessions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!selectedBatchId || !newSession.date || !newSession.time) return;
    try {
      await api.post('/sessions', { ...newSession, batchId: selectedBatchId });
      setNewSession({ title: '', date: '', time: '' });
      loadSessions(selectedBatchId);
      fetchBatches(); // Update counts
    } catch (error) {
      alert('Failed to create session');
    }
  };

  const handleDeleteBatch = async (batchId, batchName) => {
    if (!window.confirm(`Are you sure you want to delete batch "${batchName}"?`)) return;
    try {
      await api.delete(`/batches/${batchId}`);
      alert('Batch deleted successfully!');
      setSelectedBatchId(null);
      setSessions([]);
      fetchBatches();
    } catch (error) {
      alert('Failed to delete batch: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      {/* Backend Redirect Button */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary-700 sm:text-3xl">Batches</h1>
        <a
          href="https://gita-life-be.vercel.app/api"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 sm:self-auto"
        >
          Backend UI
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
        {/* Batches Section */}
        <div>
          <form onSubmit={handleCreateBatch} className="mb-6 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              required
              value={newBatchName}
              onChange={e => setNewBatchName(e.target.value)}
              placeholder="New Batch Name"
              className="devotional-input flex-1"
            />
            <button type="submit" onClick={handleCreateBatch} className="devotional-btn">
              Create
            </button>
          </form>

          <div className="space-y-4">
            {loading ? (
              <p className="devotional-muted">Loading...</p>
            ) : batches.length === 0 ? (
              <p className="devotional-muted">No batches created yet.</p>
            ) : batches.map(batch => (
              <div 
                key={batch.id} 
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  selectedBatchId === batch.id ? 'bg-[#fff0d8] border-[#e8be7a]' : 'bg-[#fffef9] border-[#ecd8b7] hover:border-[#d7b07d]'
                }`}
                onClick={() => loadSessions(batch.id)}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold text-[#3b2719] text-lg">{batch.name}</h3>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#7b614f]">
                      <span>{batch._count.students} Students</span>
                      <span>{batch._count.sessions} Sessions</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBatch(batch.id, batch.name);
                      }}
                      className="text-red-600 hover:text-red-800 font-medium text-sm px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions Section */}
        {selectedBatchId && (
          <div className="devotional-panel p-5 sm:p-6">
            <h2 className="mb-6 text-xl font-bold text-primary-700 sm:text-2xl">Sessions for Selected Batch</h2>
            
            <form onSubmit={handleCreateSession} className="bg-[#fff8ec] p-4 rounded-lg border border-[#ecd8b7] mb-6 space-y-4">
              <h4 className="font-medium text-[#5e4738]">Add New Session</h4>
              <div>
                <input type="text" placeholder="Session Title (Optional)" value={newSession.title} onChange={e => setNewSession({...newSession, title: e.target.value})} className="devotional-input text-sm" />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <input type="date" required value={newSession.date} onChange={e => setNewSession({...newSession, date: e.target.value})} className="devotional-input flex-1 text-sm" />
                <input type="time" required value={newSession.time} onChange={e => setNewSession({...newSession, time: e.target.value})} className="devotional-input flex-1 text-sm" />
              </div>
              <button type="submit" onClick={handleCreateSession} className="w-full devotional-btn text-sm">
                Add Session
              </button>
            </form>

            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="devotional-muted text-sm text-center py-4">No sessions found for this batch.</p>
              ) : sessions.map(session => (
                <div key={session.id} className="bg-[#fffef9] p-4 rounded-lg border border-[#ecd8b7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-[#3b2719]">{session.title || 'Untitled Session'}</h4>
                    <p className="text-sm text-[#6c5546]">
                      {format(new Date(session.date), 'MMMM d, yyyy')} at {session.time}
                    </p>
                  </div>
                  <Link 
                    to={`/dashboard/sessions/${session.id}/attendance`}
                    className="devotional-btn-soft whitespace-nowrap text-center text-sm"
                  >
                    Mark Attendance
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Batches;

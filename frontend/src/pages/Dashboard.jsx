import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    enrolledStudents: 0,
    activeBatches: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [leadsRes, studentsRes, batchesRes] = await Promise.all([
        api.get('/leads/count'),
        api.get('/students/count'),
        api.get('/batches/count')
      ]);
      setStats({
        totalLeads: leadsRes.data.count,
        enrolledStudents: studentsRes.data.count,
        activeBatches: batchesRes.data.count
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-700 mb-2">Dashboard</h1>
      <p className="devotional-muted mb-6">Track participation and guide the Gita learning journey.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="devotional-panel p-6">
          <h3 className="devotional-muted text-sm font-medium">Total Leads</h3>
          <p className="text-3xl font-bold text-primary-700 mt-2">
            {loading ? '--' : stats.totalLeads}
          </p>
        </div>
        <div className="devotional-panel p-6">
          <h3 className="devotional-muted text-sm font-medium">Enrolled Students</h3>
          <p className="text-3xl font-bold text-primary-700 mt-2">
            {loading ? '--' : stats.enrolledStudents}
          </p>
        </div>
        <div className="devotional-panel p-6">
          <h3 className="devotional-muted text-sm font-medium">Active Batches</h3>
          <p className="text-3xl font-bold text-primary-700 mt-2">
            {loading ? '--' : stats.activeBatches}
          </p>
        </div>
      </div>

      <div className="devotional-panel p-6">
        <h2 className="text-xl font-semibold text-primary-700 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <p className="devotional-muted">Use the sidebar to manage leads, students, and batches in one devotional workflow.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

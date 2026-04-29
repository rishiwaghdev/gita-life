import { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (error) {
      console.error('Failed to fetch leads', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleConvert = async (leadId) => {
    if (!window.confirm('Are you sure you want to convert this lead to a student?')) return;
    try {
      await api.post(`/leads/${leadId}/convert`);
      alert('Lead converted successfully!');
      fetchLeads(); // Refresh list
    } catch (error) {
      alert('Failed to convert lead: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSendMessage = async (leadId, leadName) => {
    const chatId = window.prompt(
      `Telegram chat ID for ${leadName}:`,
      ''
    );
    if (chatId === null) return;

    const sessionTime = window.prompt(`Session time for ${leadName}:`, '7:00 PM');
    if (!sessionTime) return;
    const defaultMessage = `Hello ${leadName} 🙏

Your Gita Life session is scheduled for tomorrow at ${sessionTime}.

Every session is a step forward in your journey of learning and self-growth. Try to attend regularly and stay consistent - it truly makes a difference.

We look forward to your presence. See you tomorrow!`;
    const message = window.prompt(`Telegram message to ${leadName}:`, defaultMessage);
    if (!message) return;

    try {
      await api.post(`/leads/${leadId}/send-message`, { chatId: chatId.trim(), message, sessionTime });
      alert('Telegram message sent successfully!');
    } catch (error) {
      alert('Failed to send Telegram message: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteLead = async (leadId, leadName) => {
    if (!window.confirm(`Are you sure you want to delete lead "${leadName}"?`)) return;
    try {
      await api.delete(`/leads/${leadId}`);
      alert('Lead deleted successfully!');
      fetchLeads();
    } catch (error) {
      alert('Failed to delete lead: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary-700 sm:text-3xl">Leads Management</h1>
      </div>

      <div className="devotional-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm devotional-table">
            <thead className="border-b border-[#ead3ad]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">College</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center devotional-muted">Loading...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center devotional-muted">No leads found.</td></tr>
              ) : leads.map(lead => (
                <tr key={lead.id} className="border-b border-[#f0e3cf] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#3b2719]">{lead.name}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{lead.phone}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{lead.email || '-'}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{lead.location || '-'}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{lead.college || '-'}</td>
                  <td className="px-6 py-4 text-[#5e4738]">{format(new Date(lead.createdAt), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'CONVERTED' ? 'bg-[#e7f6df] text-[#2f6415]' : 'bg-[#fff2d8] text-[#8a5f12]'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {lead.status === 'PENDING' && (
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => handleSendMessage(lead.id, lead.name)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#9bd4f5] bg-[#eaf7ff] px-2.5 py-1 text-sm font-medium text-[#0876ad] transition-colors hover:bg-[#d9f0ff]"
                        >
                          <Send size={14} />
                          Send Telegram
                        </button>
                        <button
                          onClick={() => handleConvert(lead.id)}
                          className="text-primary-700 hover:text-primary-600 font-medium text-sm"
                        >
                          Convert
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.name)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
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

export default Leads;

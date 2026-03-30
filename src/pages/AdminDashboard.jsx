import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, CheckCircle, XCircle, Search, Filter, 
  MoreVertical, Download, Eye, Loader2, Trash2, Image, 
  Settings, Plus, EyeOff, Save, Type, Layout, UploadCloud,
  Pencil
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('registrations');
  const [registrations, setRegistrations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [siteContent, setSiteContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({ title: '', date: '', price: '', description: '' });

  // Stats
  const [stats, setStats] = useState({ totalMembers: 0, activeEvents: 0, pendingTasks: 0 });

  // Registration Filter/Search
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Gallery Upload State
  const [uploading, setUploading] = useState(false);
  const [newMedia, setNewMedia] = useState({ file: null, caption: '', order: 0 });

  // Site Settings State
  const [updatingContent, setUpdatingContent] = useState(false);

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetchWithRetry(() => 
        apiClient.get('/api/v1/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      setStats(res?.data?.data || { totalMembers: 0, activeEvents: 0, pendingTasks: 0 });
    } catch (err) {
      console.error('Stats fetch failed:', err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
    }
  };

  const fetchRegistrations = async () => {
    if (!token) return;
    setLoading(true);
    
    try {
      const res = await fetchWithRetry(() => 
        apiClient.get('/api/v1/admin/members', {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: filterStatus }
        })
      );
      setRegistrations(res?.data?.data?.members || []);
    } catch (err) {
      console.error("Fetch members error:", err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetchWithRetry(() => apiClient.get('/api/v1/gallery'));
      setGallery(res?.data?.data?.items || []);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSiteContent = async () => {
    setLoading(true);
    try {
      const res = await fetchWithRetry(() => apiClient.get('/api/v1/content'));
      setSiteContent(res?.data?.data?.contents || {});
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
      setSiteContent({});
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchWithRetry(() => apiClient.get('/api/v1/events'));
      setEvents(res?.data?.data?.events || []);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStats();
      if (activeTab === 'registrations') fetchRegistrations();
      if (activeTab === 'gallery') fetchGallery();
      if (activeTab === 'events') fetchEvents();
      if (activeTab === 'settings') fetchSiteContent();
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeTab, filterStatus, token]);

  // --- REGISTRATION ACTIONS ---
  const handleUpdateStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await fetchWithRetry(() => 
        apiClient.patch(`/api/v1/admin/members/${id}`, 
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      toast.success(`Member status: ${status}`);
      fetchRegistrations();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkUpdate = async (status) => {
    if (selectedIds.length === 0) return toast.error('No items selected');
    setActionLoading(true);
    try {
      await fetchWithRetry(() => 
        apiClient.patch('/api/v1/admin/members/bulk/update', 
          { ids: selectedIds, status },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      toast.success(`Bulk ${status.toLowerCase()} successful`);
      setSelectedIds([]);
      fetchRegistrations();
      fetchStats();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --- GALLERY ACTIONS ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newMedia.file) return toast.error('Pick a file first');
    
    const formData = new FormData();
    formData.append('media', newMedia.file);
    formData.append('caption', newMedia.caption);
    formData.append('order', newMedia.order);

    setUploading(true);
    try {
      await fetchWithRetry(() => 
        apiClient.post('/api/v1/gallery', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` 
          }
        })
      );
      toast.success('Media added to gallery');
      setNewMedia({ file: null, caption: '', order: 0 });
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
    } finally {
      setUploading(false);
    }
  };

  const toggleGalleryItem = async (id) => {
    try {
      await fetchWithRetry(() => 
        apiClient.patch(`/api/v1/gallery/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      toast.success('Visibility toggled');
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!window.confirm('Delete this from gallery?')) return;
    try {
      await fetchWithRetry(() => 
        apiClient.delete(`/api/v1/gallery/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      toast.success('Deleted from gallery');
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
    }
  };

  // --- SITE SETTINGS ACTIONS ---
  const handleContentUpdate = async (section, key, value) => {
    setUpdatingContent(true);
    try {
      await fetchWithRetry(() => 
        apiClient.put('/api/v1/content', 
          { section, key, value },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      // Instant local update
      setSiteContent(prev => ({
        ...prev,
        [section]: { ...prev[section], [key]: value }
      }));
      toast.success('Content updated live');
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Server is waking up... ⏳",
        { id: "server-error" }
      );
    } finally {
      setUpdatingContent(false);
    }
  };

  // --- EVENT ACTIONS ---
  const handleOpenEventModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setEventFormData({
        title: event.title,
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        price: event.price,
        description: event.description
      });
    } else {
      setEditingEvent(null);
      setEventFormData({ title: '', date: '', price: '', description: '' });
    }
    setIsEventModalOpen(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingEvent) {
        await apiClient.patch(`/api/v1/events/${editingEvent._id}`, eventFormData);
        toast.success('Event updated successfully');
      } else {
        await apiClient.post('/api/v1/events', eventFormData);
        toast.success('Event created successfully');
      }
      setIsEventModalOpen(false);
      fetchEvents();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setActionLoading(true);
    try {
      await apiClient.delete(`/api/v1/events/${id}`);
      toast.success('Event deleted');
      fetchEvents();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Deletion failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-dark">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Command <span className="text-primary">Center.</span></h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Full Dynamic Control over Otter Society</p>
          </div>
          
          {/* TABS */}
          <div className="flex bg-white/5 p-2 rounded-3xl border border-white/5">
            {[
              { id: 'registrations', icon: <Users size={16}/>, label: 'REGISTRATIONS' },
              { id: 'events', icon: <Calendar size={16}/>, label: 'EVENTS' },
              { id: 'gallery', icon: <Image size={16}/>, label: 'GALLERY' },
              { id: 'settings', icon: <Settings size={16}/>, label: 'SITE SETTINGS' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${
                  activeTab === tab.id ? 'bg-primary text-dark' : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* STATS (Sticky Top) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'TOTAL MEMBERS', value: stats.totalMembers, icon: <Users className="text-primary" /> },
            { label: 'ACTIVE EVENTS', value: stats.activeEvents, icon: <Calendar className="text-secondary" /> },
            { label: 'PENDING TASKS', value: stats.pendingTasks, icon: <CheckCircle className="text-green-500" /> },
          ].map((s, i) => (
            <div key={i} className="glass-effect p-10 rounded-[40px] border-white/5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2">{s.label}</p>
                <h3 className="text-5xl font-black leading-none">{s.value}</h3>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl">{s.icon}</div>
            </div>
          ))}
        </div>

        {/* TAB CONTENT: REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col lg:flex-row justify-between gap-8 items-center">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by member name..."
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-primary/50 font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto">
                <select 
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none font-black text-xs uppercase tracking-widest"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">ALL STATUS</option>
                  <option value="Pending">PENDING</option>
                  <option value="Approved">APPROVED</option>
                  <option value="Rejected">REJECTED</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={() => handleBulkUpdate('Approved')} disabled={selectedIds.length === 0 || actionLoading} className="px-6 py-4 bg-green-500/20 text-green-500 border border-green-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500/30 hover:scale-[1.02] transition-all disabled:opacity-30 flex items-center gap-2">
                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                    BULK APPROVE ({selectedIds.length})
                  </button>
                  <button onClick={() => handleBulkUpdate('Rejected')} disabled={selectedIds.length === 0 || actionLoading} className="px-6 py-4 bg-red-500/20 text-red-500 border border-red-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 hover:scale-[1.02] transition-all disabled:opacity-30 flex items-center gap-2">
                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                    BULK REJECT ({selectedIds.length})
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-[40px] overflow-hidden border-white/5">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="p-8"><input type="checkbox" className="w-4 h-4 cursor-pointer" /></th>
                    <th className="px-6 py-8">Member</th>
                    <th className="px-6 py-8">Event</th>
                    <th className="px-6 py-8">Payment</th>
                    <th className="px-6 py-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm uppercase font-bold">
                  {loading ? (
                    <tr><td colSpan="5" className="p-40 text-center"><Loader2 className="animate-spin text-primary mx-auto" size={48} /></td></tr>
                  ) : Array.isArray(registrations) && registrations
                      .filter(reg => 
                        reg.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        reg.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((reg) => (
                    <tr key={reg?._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-8"><input type="checkbox" className="w-4 h-4 cursor-pointer" checked={selectedIds.includes(reg?._id)} onChange={() => setSelectedIds(prev => prev.includes(reg?._id) ? prev.filter(i => i !== reg?._id) : [...prev, reg?._id])} /></td>
                      <td className="px-6 py-8"><p className="text-white">{reg.userId?.name}</p><p className="text-gray-500 text-xs tracking-normal">{reg.userId?.email}</p></td>
                      <td className="px-6 py-8"><p className="text-white">{reg.eventId?.title}</p></td>
                      <td className="px-6 py-8 text-primary">
                        <div className="flex flex-col gap-2">
                          <a href={reg.paymentProofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline"><Eye size={14} /> VIEW PROOF</a>
                          {reg.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button 
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(reg._id, 'Approved')}
                                className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 disabled:opacity-50"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button 
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(reg._id, 'Rejected')}
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 disabled:opacity-50"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-8"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${reg.status === 'Approved' ? 'bg-green-500/20 text-green-500' : reg.status === 'Rejected' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>{reg.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!Array.isArray(registrations) || registrations.length === 0) && !loading && (
                <div className="p-40 text-center text-gray-600 font-bold uppercase tracking-widest flex flex-col items-center gap-4">
                  <span className="text-4xl">🚫</span>
                  No members found
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: EVENTS MANAGER */}
        {activeTab === 'events' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between gap-8 items-center">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Manage Events.</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Add, update or remove sports events</p>
              </div>
              <button 
                onClick={() => handleOpenEventModal()}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-dark rounded-2xl text-[10px] font-black tracking-widest uppercase hover:scale-[1.05] transition-all shadow-lg shadow-primary/10"
              >
                <Plus size={16} /> ADD EVENT
              </button>
            </div>

            <div className="glass-effect rounded-[40px] overflow-hidden border-white/5">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-8 py-8">Title</th>
                    <th className="px-6 py-8">Date</th>
                    <th className="px-6 py-8">Price</th>
                    <th className="px-6 py-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm uppercase font-bold text-white">
                  {loading ? (
                    <tr><td colSpan="4" className="p-40 text-center"><Loader2 className="animate-spin text-primary mx-auto" size={48} /></td></tr>
                  ) : events.length > 0 ? (
                    events.map((event) => (
                      <tr key={event._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-8">
                          <p className="text-white">{event.title}</p>
                          <p className="text-gray-500 text-[10px] lowercase font-medium tracking-normal mt-1">{event.type}</p>
                        </td>
                        <td className="px-6 py-8">
                          {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-8 text-primary">₹ {event.price}</td>
                        <td className="px-6 py-8 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleOpenEventModal(event)}
                              disabled={actionLoading}
                              className="p-3 bg-white/5 text-white rounded-xl hover:bg-primary hover:text-dark transition-all disabled:opacity-50"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteEvent(event._id)}
                              disabled={actionLoading}
                              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all hover:text-white disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-40 text-center">
                        <div className="flex flex-col items-center gap-4 text-gray-600">
                          <span className="text-4xl">🚀</span>
                          <p className="font-black uppercase tracking-widest">No events found. Add your first event</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="space-y-16 animate-fade-in">
            {/* UPLOAD BOX */}
            <div className="glass-effect p-12 rounded-[50px] border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                <UploadCloud className="text-primary" /> ADD NEW MOMENTS
              </h2>
              
              <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-2 relative group cursor-pointer">
                  <input 
                    type="file" 
                    onChange={(e) => setNewMedia({...newMedia, file: e.target.files[0]})}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept="image/*,video/*"
                  />
                  <div className="h-40 glass-effect rounded-3xl border-dashed border-2 border-white/10 flex flex-col items-center justify-center group-hover:border-primary/50 transition-all text-gray-500">
                    {newMedia.file ? (
                      <p className="text-primary font-bold">{newMedia.file.name}</p>
                    ) : (
                      <>
                        <Plus className="mb-2" />
                        <p className="text-xs font-black uppercase tracking-widest">Select Image or Video (Max 50MB)</p>
                      </>
                    )}
                  </div>
                </div>
                <input 
                  type="text" 
                  placeholder="Caption for this moment..."
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-primary/50 font-bold"
                  value={newMedia.caption}
                  onChange={(e) => setNewMedia({...newMedia, caption: e.target.value})}
                />
                <button 
                  disabled={uploading}
                  className="bg-primary text-dark font-black rounded-3xl hover:bg-primary/80 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center p-6 shadow-lg shadow-primary/10"
                >
                  {uploading ? <Loader2 className="animate-spin" /> : 'UPLOAD MOMENT'}
                </button>
              </form>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                <div className="col-span-full py-40 text-center"><Loader2 className="animate-spin text-primary mx-auto" size={48} /></div>
              ) : Array.isArray(gallery) && gallery.map((item) => (
                <div key={item?._id} className="group glass-effect rounded-[40px] overflow-hidden border-white/5 relative">
                  <div className="aspect-[4/5] overflow-hidden">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gray-500 font-bold truncate mb-4">{item.caption || 'No caption'}</p>
                    <div className="flex justify-between items-center gap-4">
                      <button 
                        onClick={() => toggleGalleryItem(item._id)}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${
                          item.isActive ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {item.isActive ? <div className="flex items-center justify-center gap-2"><Eye size={12}/> ACTIVE</div> : <div className="flex items-center justify-center gap-2"><EyeOff size={12}/> HIDDEN</div>}
                      </button>
                      <button 
                        onClick={() => deleteGalleryItem(item._id)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {(!Array.isArray(gallery) || gallery.length === 0) && !loading && (
                <div className="col-span-full py-20 text-center text-gray-500 font-black tracking-widest uppercase italic">No moments captured yet.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-12 animate-fade-in max-w-4xl">
            {siteContent && Object.keys(siteContent).map(section => (
              <div key={section} className="glass-effect p-12 rounded-[50px] border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <h2 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter">
                  <Settings className="text-secondary" /> {section} Configuration.
                </h2>
                
                <div className="space-y-8">
                  {siteContent[section] && Object.keys(siteContent[section]).map(key => (
                    <div key={key}>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-4">{key}</label>
                      <div className="flex gap-4">
                        <textarea 
                          rows={key === 'description' || key.includes('description') ? 4 : 1}
                          className="flex-1 bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-secondary/50 font-bold transition-all text-white"
                          value={siteContent[section][key]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiteContent(prev => ({
                              ...prev,
                              [section]: { ...prev[section], [key]: val }
                            }));
                          }}
                        />
                        <button 
                          onClick={() => handleContentUpdate(section, key, siteContent[section][key])}
                          className="p-6 bg-secondary text-white rounded-3xl hover:bg-secondary/80 hover:scale-[1.05] transition-all self-end shadow-lg shadow-secondary/10"
                        >
                          <Save size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* REUSABLE EVENT MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-dark/90 backdrop-blur-md" onClick={() => !actionLoading && setIsEventModalOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl glass-effect p-8 sm:p-12 rounded-[50px] border-white/10 animate-fade-in overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">
              {editingEvent ? 'Edit' : 'Create'} <span className="text-primary text-4xl">Event.</span>
            </h2>

            <form onSubmit={handleEventSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Event Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Midnight Cricket Cup"
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-primary/50 font-bold transition-all"
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Event Date</label>
                  <input 
                    required
                    type="date" 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-primary/50 font-bold transition-all text-white"
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Price (INR)</label>
                  <input 
                    required
                    type="number" 
                    placeholder="e.g. 500"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-primary/50 font-bold transition-all"
                    value={eventFormData.price}
                    onChange={(e) => setEventFormData({...eventFormData, price: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Speak about the event..."
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-primary/50 font-bold transition-all text-white"
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => !actionLoading && setIsEventModalOpen(false)}
                  className="flex-1 py-5 rounded-3xl text-[10px] font-black tracking-widest uppercase border border-white/10 hover:bg-white/5 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="flex-[2] py-5 bg-primary text-dark rounded-3xl text-[10px] font-black tracking-widest uppercase hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-primary/10"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={16} /> : (editingEvent ? 'SAVE CHANGES' : 'CREATE EVENT')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

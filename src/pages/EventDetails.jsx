import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, IndianRupee, MapPin, Upload, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../config/apiClient';
import { fetchWithRetry } from '../utils/fetchUtils';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    emergencyContact: '',
    hasParticipatedBefore: false,
    medicalConditions: '',
  });
  const [paymentProof, setPaymentProof] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);

      try {
        const res = await fetchWithRetry(() => apiClient.get(`/api/v1/events/${id}`));
        setEvent(res?.data?.data?.event || null);
      } catch (err) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Server is waking up... ⏳",
          { id: "server-error" }
        );
        // Mock data for development if API fails
        setEvent({
          _id: id,
          title: 'Sunday Smash Cricket',
          description: "Experience the ultimate Sunday morning cricket match at our premium arena. Open for all skill levels, with professional umpires and top-tier equipment provided. Lunch and refreshments included in the fee.",
          date: new Date(),
          fee: 500,
          capacity: 22,
          slotsLeft: 4,
          imageUrl: 'https://plus.unsplash.com/premium_photo-1661884177579-247072c49c71?auto=format&fit=crop&q=80&w=800',
          type: 'Cricket',
        });
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchEvent();
    }, 3000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentProof) return toast.error('Please upload payment screenshot');

    const data = new FormData();
    data.append('eventId', id);
    data.append('age', formData.age);
    data.append('emergencyContact', formData.emergencyContact);
    data.append('hasParticipatedBefore', formData.hasParticipatedBefore);
    data.append('medicalConditions', formData.medicalConditions);
    data.append('paymentProof', paymentProof);

    setSubmitting(true);
    let loadingToast;
    const timer = setTimeout(() => {
      loadingToast = toast.loading("Processing registration... ⏳");
    }, 2000);

    try {
      if (!isAuthenticated) {
        toast.error('Please login to register');
        return navigate('/login');
      }

      await fetchWithRetry(() => 
        apiClient.post('/api/v1/registrations', data, {
          headers: { 
            'Content-Type': 'multipart/form-data', 
            Authorization: `Bearer ${token}` 
          }
        })
      );
      toast.success('Registration submitted! Awaiting admin approval.');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      clearTimeout(timer);
      if (loadingToast) toast.dismiss(loadingToast);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary" size={64} /></div>;
  if (!event) return <div className="text-center py-40 h-screen font-black uppercase text-gray-500 tracking-widest">Event not found.</div>;

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="container mx-auto">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft size={20} />
          <span>Go Back</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* LEFT: EVENT INFO */}
          <div className="lg:w-2/3">
            <div className="relative h-[400px] md:h-[600px] rounded-[48px] overflow-hidden mb-12">
              <img src={event?.imageUrl || 'https://via.placeholder.com/800x600?text=Event+Image'} alt={event?.title} className="w-full h-full object-cover" />
              <div className="absolute top-8 right-8 bg-primary text-dark font-black px-8 py-3 rounded-full text-lg shadow-2xl">
                {event?.type || 'Sport'}
              </div>
            </div>

            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-tight">{event?.title || 'Event Details'}</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 p-8 glass-effect rounded-3xl border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">DATE</span>
                <div className="flex items-center gap-2 font-black text-lg">
                  <Calendar size={18} className="text-primary" />
                  {event?.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">FEE</span>
                <div className="flex items-center gap-2 font-black text-lg text-primary">
                  <IndianRupee size={18} />
                  {event?.fee || 0}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">SLOTS LEFT</span>
                <div className="flex items-center gap-2 font-black text-lg">
                  <Users size={18} className="text-primary" />
                  {event?.slotsLeft || 0} / {event?.capacity || 0}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">LOCATION</span>
                <div className="flex items-center gap-2 font-black text-lg">
                  <MapPin size={18} className="text-primary" />
                  Elite Arena
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-black mb-6">About the Match</h3>
            <p className="text-xl text-gray-400 font-medium leading-relaxed mb-12">
              {event?.description || 'No description available for this event.'}
            </p>
          </div>

          {/* RIGHT: REGISTRATION FORM */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 glass-effect p-12 rounded-[48px] border-white/10 shadow-2xl">
              <h2 className="text-3xl font-black mb-8">Secure Your <br /> <span className="text-primary">Spot Today.</span></h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">YOUR AGE</label>
                  <input 
                    required 
                    type="number" 
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 text-white font-bold"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">EMERGENCY CONTACT</label>
                  <input 
                    required 
                    type="text" 
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 text-white font-bold"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">MEDICAL CONDITIONS (IF ANY)</label>
                  <textarea 
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 text-white font-bold h-24"
                    value={formData.medicalConditions}
                    onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                  />
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-sm font-black mb-6 uppercase tracking-widest">PAYMENT VIA UPI</h4>
                  <div className="bg-white p-4 rounded-3xl mb-6 aspect-square max-w-[200px] mx-auto grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden text-dark">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ottersociety@upi" alt="QR Code" className="w-full h-full" />
                  </div>
                  <p className="text-center text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest">Scan to pay: <span className="text-primary">ottersociety@upi</span></p>
                  
                  <label className="cursor-pointer group">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 p-8 rounded-3xl group-hover:border-primary/50 transition-colors">
                      <Upload className="text-gray-500 group-hover:text-primary transition-colors mb-2" />
                      <span className="text-xs font-black text-gray-400 group-hover:text-primary transition-colors uppercase tracking-widest">
                        {paymentProof ? paymentProof.name : 'Upload Screenshot'}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => setPaymentProof(e.target.files[0])}
                    />
                  </label>
                </div>

                <button 
                  disabled={submitting || event.isFull}
                  type="submit"
                  className={`mt-8 py-5 rounded-full font-black text-lg transition-all transform active:scale-95 ${
                    event.isFull ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-primary text-dark hover:bg-primary/80 hover:scale-[1.02] shadow-[0_0_30px_rgba(0,209,181,0.3)]'
                  }`}
                >
                  {submitting ? 'SUBMITTING MATCH...' : event.isFull ? 'FULLY BOOKED' : 'SUBMIT REGISTRATION'}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default EventDetails;

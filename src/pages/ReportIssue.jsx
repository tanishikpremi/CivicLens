import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mcpClient } from '../lib/mcpClient';

export const ReportIssue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Road & Pavement Damage',
    severity: 'Medium',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcIRU0Uj8xEwa30xXbNHIYViOhgAmFtaawUg799zbsurjt91Th8qqqxmJhEfbetQnG3NDuj3-jcoCdjgKlgFID9U2zYxvk-jbV5sQ62hKT95KKZL8IQHZcYAbJZeYZ9gdoSU98PesSLeLWiZPl9aZ6l7NNQKcxgfPu6qCsyG_i5BmfKoGUH6M6VVgLIFgcN2Q2DpL4-P-NbB9eYoy-M3_C6p-6XkQ0Ju8FmdDCZJdXl-GrTMRFC4eaBXc0eo4p0x3HTagLyOboQZ9C',
    lat: 28.6328,
    lng: 77.2197,
    author: 'Anonymous Citizen',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await mcpClient.createPost(formData);
    navigate('/');
  };

  return (
    <div className="bg-[#edfaf1] text-[#26312b] min-h-screen pb-32 font-[Manrope]" style={{background: 'radial-gradient(circle at 10% 20%, rgba(107, 255, 143, 0.08) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(0, 106, 45, 0.05) 0%, transparent 50%)'}}>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 h-16 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-emerald-700 hover:bg-emerald-50/50 transition-colors active:scale-95 duration-200 p-2 rounded-full flex">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-semibold tracking-tight text-emerald-900 text-lg">Report Issue</h1>
        </div>
        <div className="text-xl font-extrabold tracking-tighter text-emerald-800">CivicLens</div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        {/* Stepper */}
        <div className="flex justify-center items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#006a2d] shadow-[0_0_12px_rgba(0,106,45,0.4)]"></div>
          <div className="w-20 h-0.5 bg-[#dcece2] rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-[#006a2d]"></div>
          </div>
          <div className="w-3 h-3 rounded-full bg-[#006a2d] shadow-[0_0_12px_rgba(0,106,45,0.4)]"></div>
          <div className="w-20 h-0.5 bg-[#dcece2] rounded-full"></div>
          <div className="w-3 h-3 rounded-full bg-[#cfe1d6]"></div>
        </div>

        {/* Image Upload Card */}
        <section className="bg-white rounded-[28px] p-6 shadow-[0_20px_40px_-12px_rgba(0,106,45,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#26312b]">Visual Evidence</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#006a2d] bg-[#6bff8f]/30 px-3 py-1 rounded-full">Required</span>
          </div>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#e6f4eb] border-2 border-dashed border-[#a3b0a8]/30 flex flex-col items-center justify-center gap-3">
            <img alt="Damaged infrastructure" className="absolute inset-0 w-full h-full object-cover opacity-80" src={formData.image_url}/>
            <div className="relative z-10 bg-white/70 backdrop-blur-xl p-4 rounded-full text-[#006a2d] shadow-lg focus-within:scale-95 cursor-pointer flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">add_a_photo</span>
            </div>
            <p className="relative z-10 text-xs text-[#525e58] font-medium">Tap to retake photo</p>
          </div>
        </section>

        {/* Location Card */}
        <section className="bg-white rounded-[28px] p-6 shadow-[0_20px_40px_-12px_rgba(0,106,45,0.06)] flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[#26312b]">Precise Location</h3>
              <div className="flex items-center gap-1 text-[#525e58]">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <p className="text-sm font-medium">Connaught Place, Delhi ({formData.lat.toFixed(4)}, {formData.lng.toFixed(4)})</p>
              </div>
            </div>
            <button className="bg-[#e6f4eb] hover:bg-[#dcece2] text-[#006a2d] font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-all">
              Adjust Pin
            </button>
          </div>
          <div className="w-full h-40 rounded-2xl overflow-hidden relative grayscale-[0.3] contrast-[0.9]">
            <img alt="Map view" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-tNYGjm2u9oJVY80LGQRbAJxp9pv5xIRHkFUg4ydDjwCaHCKWgJfhpu35KFAG0QAF9H0Y95LyLMtyuES-8IadYPUsm_D8jfYf1FwAbfOBKhcwxQZ9djPa5EZvbvPrSbWHGd2f_bWcze1cgIxZjVQpmJ7b45hOT2_fwLmIu5-cr4T9UkDK0eSPh40ij2I_KBeNEbbMi0cwxG1wOZEwNRwbNtXaJ_oNVs0JPFfy4H6NP9ljHLN-HAF3zd19uRUNDd3DYXS1fDasL7-M"/>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#006a2d]/20 rounded-full animate-pulse"></div>
                <span className="material-symbols-outlined text-[#006a2d] text-4xl drop-shadow-lg" style={{fontVariationSettings: "'FILL' 1"}}>location_pin</span>
              </div>
            </div>
          </div>
        </section>

        {/* Details & Inputs */}
        <section className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-[#525e58] px-1">Issue Category</label>
            <div className="relative">
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-[#e6f4eb] border-none rounded-2xl p-4 text-[#26312b] focus:ring-2 focus:ring-[#006a2d]/20 appearance-none font-medium">
                <option>Road & Pavement Damage</option>
                <option>Sanitation & Waste</option>
                <option>Street Lighting</option>
                <option>Public Greenery</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6d7a73]">expand_more</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-[#525e58] px-1">Severity Level</label>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setFormData({...formData, severity: 'Low'})} type="button" className={`${formData.severity === 'Low' ? 'border-2 border-[#006a2d]/20 text-[#006a2d] bg-white text-center' : 'border border-[#a3b0a8]/30 text-[#525e58] bg-white text-center'} p-3 rounded-full flex flex-col items-center justify-center transition-all hover:bg-[#6bff8f]/10`}>
                <span className="text-xs font-bold uppercase tracking-widest">Low</span>
              </button>
              <button onClick={() => setFormData({...formData, severity: 'Medium'})} type="button" className={`${formData.severity === 'Medium' ? 'border-2 border-amber-400/50 text-amber-700 bg-amber-50 text-center' : 'border border-[#a3b0a8]/30 text-[#525e58] bg-white text-center'} p-3 rounded-full flex flex-col items-center justify-center transition-all hover:bg-amber-50/50`}>
                <span className="text-xs font-bold uppercase tracking-widest">Medium</span>
              </button>
              <button onClick={() => setFormData({...formData, severity: 'High'})} type="button" className={`${formData.severity === 'High' ? 'border-2 border-red-500/50 text-red-700 bg-red-50 text-center' : 'border border-[#a3b0a8]/30 text-[#525e58] bg-white text-center'} p-3 rounded-full flex flex-col items-center justify-center transition-all hover:bg-red-50/50`}>
                <span className="text-xs font-bold uppercase tracking-widest">High</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-[#525e58] px-1">Report Title</label>
            <input 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[#e6f4eb] border-none rounded-2xl p-4 text-[#26312b] focus:ring-2 focus:ring-[#006a2d]/20 placeholder:text-[#6d7a73] font-medium" 
              placeholder="E.g. Large crater forming on 5th and main"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-[#525e58] px-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-[#e6f4eb] border-none rounded-2xl p-4 text-[#26312b] focus:ring-2 focus:ring-[#006a2d]/20 placeholder:text-[#6d7a73] font-medium resize-none" 
              placeholder="Describe the issue in a few words..." 
              rows="3"
            ></textarea>
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-[#525e58] px-1">AI Intelligence Tags</label>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-[#6bff8f]/30 text-[#005f28] px-4 py-2 rounded-full text-sm font-semibold">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>#pothole
              </div>
              <div className="flex items-center gap-2 bg-[#6bff8f]/30 text-[#005f28] px-4 py-2 rounded-full text-sm font-semibold">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>#urgent
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* BottomNavBar as CTA Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center gap-4 bg-white/90 backdrop-blur-xl rounded-t-[3rem] px-8 pt-4 pb-8 shadow-[0_-20px_40px_-12px_rgba(0,106,45,0.08)]">
        <Link to="/" className="flex items-center justify-center gap-2 text-emerald-800 px-6 py-4 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors active:scale-[0.97] duration-200">
          <span className="material-symbols-outlined">close</span>
        </Link>
        <button onClick={handleSubmit} disabled={isSubmitting || !formData.title.trim()} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-[#6bff8f] to-[#006a2d] text-white rounded-full px-8 py-4 shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity active:scale-[0.97] duration-200 disabled:opacity-50">
          <span className="material-symbols-outlined">send</span>
          <span className="text-sm font-bold uppercase tracking-widest">
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </span>
        </button>
      </nav>
    </div>
  );
};

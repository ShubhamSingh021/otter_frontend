import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  { name: 'Sameer Khan', role: 'Cricket Enthusiast', content: "Sundays at Otter Society are the highlight of my week. The energy is unmatched and the competition is fierce but friendly.", avatar: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Arjun Verma', role: 'Marathon Runner', content: "Joining the club was the best decision for my fitness and social life. The community is so welcoming and supportive.", avatar: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Rohan Sharma', role: 'Badminton Pro', content: "Finally found a club that takes sports seriously but keeps the fun alive. The events are super well managed every time.", avatar: 'https://i.pravatar.cc/150?u=3' },
];

const Testimonials = () => {
  return (
    <section className="py-32 px-6 bg-dark">
      <div className="container mx-auto">
        
        <div className="text-center mb-20">
          <h4 className="text-secondary font-bold tracking-widest uppercase mb-4">THE VOICE</h4>
          <h2 className="text-4xl md:text-7xl font-black">Members <span className="text-gray-500">Love Us.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {testimonials.map((test, i) => (
            <div 
              key={i} 
              className="glass-effect p-12 rounded-[48px] border-white/5 hover:border-white/20 transition-all duration-500 group"
            >
              <Quote className="text-primary group-hover:scale-125 transition-transform duration-500 mb-8" size={40} />
              <p className="text-xl text-gray-300 font-medium leading-relaxed italic mb-10">"{test.content}"</p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={test.avatar} 
                  alt={test.name} 
                  className="w-14 h-14 rounded-full border-2 border-primary group-hover:border-white transition-colors"
                />
                <div>
                  <h4 className="font-black text-white">{test.name}</h4>
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

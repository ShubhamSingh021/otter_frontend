import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

const Membership = () => {
  const plans = [
    {
      name: 'Rookie',
      price: 'Free',
      features: ['Basic community access', 'Event participation', '1 Sport tracking'],
      icon: <Users size={32} />,
      color: 'bg-gray-500/10 text-gray-400'
    },
    {
      name: 'Elite',
      price: '$49/mo',
      features: ['Premium event access', 'Personalized coaching', 'Full sport analytics', 'Exclusive perks'],
      icon: <Trophy size={32} />,
      color: 'bg-primary/10 text-primary',
      featured: true
    },
    {
      name: 'PRO',
      price: '$99/mo',
      features: ['All Elite features', 'Unlimited sport tracking', 'Custom training plans', 'Priority registration'],
      icon: <Zap size={32} />,
      color: 'bg-secondary/10 text-secondary'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-dark">
      <div className="container mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black mb-8 italic"
          >
            CHOOSE YOUR <span className="text-primary italic">TIER.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-3xl mx-auto font-medium"
          >
            Unlock the full potential of the Otter Society. From casual play to professional 
            training, we have a membership for every level of commitment.
          </motion.p>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`p-10 rounded-[64px] border ${plan.featured ? 'border-primary/50 shadow-[0_0_50px_rgba(0,209,181,0.1)]' : 'border-white/5'} glass-effect flex flex-col items-center text-center relative overflow-hidden`}
            >
              {plan.featured && (
                <div className="absolute top-8 right-8 px-4 py-1.5 bg-primary text-dark font-black text-[10px] rounded-full uppercase tracking-widest animate-pulse">
                  Popular
                </div>
              )}
              
              <div className={`p-6 rounded-full ${plan.color} mb-10`}>
                {plan.icon}
              </div>

              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{plan.name}</h3>
              <div className="text-5xl font-black text-white mb-10 tracking-widest">{plan.price}</div>

              <ul className="flex flex-col gap-5 text-left w-full mb-12">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                    <ShieldCheck size={18} className="text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`mt-auto w-full py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all ${plan.featured ? 'bg-primary text-dark hover:scale-105 active:scale-95' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        {/* CALL TO ACTION */}
        <div className="mt-24 p-12 md:p-20 rounded-[80px] bg-primary flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-white rounded-full blur-[200px]" />
            </div>
            <div className="relative z-10 text-dark">
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none">JOIN THE <br/>SOCIETY TODAY.</h2>
                <p className="text-dark/70 font-bold max-w-lg">Become part of the most exclusive sports club. Start your journey with professional training and elite networking.</p>
            </div>
            <button className="relative z-10 px-12 py-6 bg-dark text-white font-black text-lg rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-4">
               Apply Now <ArrowRight size={24} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default Membership;

import React from 'react';
import Hero from '../sections/Hero';
import Story from '../sections/Story';
import EventsPreview from '../sections/EventsPreview';
import Testimonials from '../sections/Testimonials';
import Gallery from '../sections/Gallery';
import Membership from '../sections/Membership';

const Home = () => {
  return (
    <div className="home-page overflow-x-hidden">
      <Hero />
      <Story />
      <EventsPreview />
      <Gallery />
      <Testimonials />
      <Membership />
    </div>
  );
};

export default Home;

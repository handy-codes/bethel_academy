import React from 'react';
import PageHero from '../components/PageHero';
import TechPrograms from '../components/TechPrograms';
import InnovationLab from '../components/InnovationLab';
import TechEvents from '../components/TechEvents';
import StudentProjects from '../components/StudentProjects';

export default function TechPage() {
  return (
    <>
      <PageHero 
        title="Technology & Innovation" 
        subtitle="Shaping the Future"
        description="Explore our cutting-edge technology programs and innovation ecosystem"
      />
      <TechPrograms />
      <InnovationLab />
      <TechEvents />
      <StudentProjects />
    </>
  );
}
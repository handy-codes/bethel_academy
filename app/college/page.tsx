import React from 'react';
import PageHero from '../components/PageHero';
import CollegeHistory from '../components/CollegeHistory';
import Leadership from '../components/Leadership';
import CampusTour from '../components/CampusTour';
import Stats from '../components/Stats';

export default function CollegePage() {
  return (
    <>
      <PageHero 
        title="About Bethel Academy" 
        subtitle="Excellence in Education Since 1992"
        description="Championing Education in a Digital World!"
      />
      <CollegeHistory />
      <Leadership />
      <CampusTour />
      <Stats />
    </>
  );
}

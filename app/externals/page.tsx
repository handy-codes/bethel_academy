import React from 'react';
import PageHero from '../components/PageHero';
import ExchangePrograms from '../components/ExchangePrograms';
import IndustryPartnerships from '../components/IndustryPartnerships';
import InternshipOpportunities from '../components/InternshipOpportunities';
import AlumniNetwork from '../components/AlumniNetwork';

export default function ExternalsPage() {
  return (
    <>
      <PageHero 
        title="External Programs" 
        subtitle="Beyond the Classroom"
        description="Connect with global opportunities and industry partnerships"
      />
      <ExchangePrograms />
      <IndustryPartnerships />
      <InternshipOpportunities />
      <AlumniNetwork />
    </>
  );
}
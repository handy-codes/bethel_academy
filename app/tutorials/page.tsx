import React from 'react';
import PageHero from '../components/PageHero';
import TutorialCategories from '../components/TutorialCategories';
import FeaturedTutorials from '../components/FeaturedTutorials';
import LearningResources from '../components/LearningResources';

export default function TutorialsPage() {
  return (
    <>
      <PageHero 
        title="Academic Tutorials" 
        subtitle="Master Your Subjects"
        description="Access our comprehensive library of learning resources and video tutorials"
      />
      <TutorialCategories />
      <FeaturedTutorials />
      <LearningResources />
    </>
  );
}
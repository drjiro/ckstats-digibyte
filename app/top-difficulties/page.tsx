export const revalidate = 60;

import React from 'react';

import TopUserDifficulties from '../../components/TopUserDifficulties';

export const metadata = {
  title: 'Top 100 User Difficulties - ArkPool2',
  description: 'View the top 100 user difficulties on ArkPool2.',
};

export default function TopDifficultiesPage() {
  return (
    <div className="container mx-auto p-4">
      <TopUserDifficulties limit={100} />
    </div>
  );
}

export const revalidate = 60;

import React from 'react';

import TopUserHashrates from '../../components/TopUserHashrates';

export const metadata = {
  title: 'Top 100 User Hashrates - ArkPool2',
  description: 'View the top 100 user hashrates on ArkPool2.',
};

export default function TopHashratesPage() {
  return (
    <div className="container mx-auto p-4">
      <TopUserHashrates limit={100} />
    </div>
  );
}

import React from 'react';
import { UserDietPlans } from '@/features/diet/components/UserDietPlans';

export const UserDietPlansPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <UserDietPlans />
    </div>
  );
};

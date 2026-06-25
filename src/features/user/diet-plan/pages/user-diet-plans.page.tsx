import React from 'react';
import { UserDietPlans } from '../components/user-diet-plans';

export const UserDietPlansPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <UserDietPlans />
    </div>
  );
};

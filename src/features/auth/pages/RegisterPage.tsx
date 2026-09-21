import React from 'react';
import RegisterForm from '@/features/auth/components/RegisterForm';

export const UserRegisterPage = () => {
  return (
    <div>
      <RegisterForm role="user" />
    </div>
  );
};

export const TrainerRegisterPage = () => {
  return (
    <div>
      <RegisterForm role="trainer" />
    </div>
  );
};

export default UserRegisterPage;

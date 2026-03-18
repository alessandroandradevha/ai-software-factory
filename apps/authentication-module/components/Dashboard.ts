import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { trpc } from '../lib/trpc';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '../lib/api';

interface Session {
  user: {
    name: string;
  };
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      </div>
    );
  }

  const handleRegister = async () => {
    try {
      await api.register({ name: session.user.name });
      router.push('/register');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      await api.login({ name: session.user.name });
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <button onClick={() => signOut()}>Sign out</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Dashboard;
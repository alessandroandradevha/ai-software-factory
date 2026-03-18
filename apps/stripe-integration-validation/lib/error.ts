import React from 'react';

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return <div style={{ color: 'red' }}>{message}</div>;
};

export { Error };
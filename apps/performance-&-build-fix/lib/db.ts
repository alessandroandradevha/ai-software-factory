import { NEXT_PUBLIC_API_URL } from './constants';

export const getBuildErrors = async (): Promise<any[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/build-errors`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getCodeOptimizations = async (): Promise<any[]> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/code-optimizations`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getPerformanceData = async (): Promise<any> => {
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}/performance-data`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

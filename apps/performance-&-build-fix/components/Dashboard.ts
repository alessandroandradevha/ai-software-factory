import { useState, useEffect, useCallback } from 'react';
import { getBuildErrors, getCodeOptimizations, getPerformanceData } from '../lib/db';
import type { BuildError, CodeOptimization, PerformanceData } from '../lib/db';
import { NEXT_PUBLIC_API_URL } from '../lib/constants';

const Dashboard = () => {
  const [buildErrors, setBuildErrors] = useState<BuildError[]>([]);
  const [codeOptimizations, setCodeOptimizations] = useState<CodeOptimization[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({});
  const [error, setError] = useState<string | null>(null);

  const fetchBuildErrors = useCallback(async () => {
    try {
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
      const errors = await response.json();
      setBuildErrors(errors);
    } catch (error: any) {
      setError(error.message);
    }
  }, [NEXT_PUBLIC_API_URL]);

  const fetchCodeOptimizations = useCallback(async () => {
    try {
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
      const optimizations = await response.json();
      setCodeOptimizations(optimizations);
    } catch (error: any) {
      setError(error.message);
    }
  }, [NEXT_PUBLIC_API_URL]);

  const fetchPerformanceData = useCallback(async () => {
    try {
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
      const data = await response.json();
      setPerformanceData(data);
    } catch (error: any) {
      setError(error.message);
    }
  }, [NEXT_PUBLIC_API_URL]);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchBuildErrors(),
        fetchCodeOptimizations(),
        fetchPerformanceData()
      ]);
    };
    fetchAllData();
    return () => {
      // cleanup
    };
  }, [fetchBuildErrors, fetchCodeOptimizations, fetchPerformanceData]);

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <h1>Build Errors</h1>
          <ul>
            {buildErrors.map((error) => (
              <li key={error.id}>{error.message}</li>
            ))}
          </ul>
          <h1>Code Optimizations</h1>
          <ul>
            {codeOptimizations.map((optimization) => (
              <li key={optimization.id}>{optimization.message}</li>
            ))}
          </ul>
          <h1>Performance Data</h1>
          <ul>
            {Object.keys(performanceData).map((key) => (
              <li key={key}>{key}: {performanceData[key]}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

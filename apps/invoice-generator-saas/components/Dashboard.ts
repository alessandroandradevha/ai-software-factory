import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/db';
import InvoiceTemplate from './InvoiceTemplate';
import ClientManagement from './ClientManagement';
import PaymentTracking from './PaymentTracking';

interface DashboardProps {
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Example of fetching data from supabase
        const { data, error } = await supabase.from('table').select('*');
        if (error) {
          setError(error);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <InvoiceTemplate />
      <ClientManagement />
      <PaymentTracking />
    </>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/db';
import { useRouter } from 'next/router';
import InvoiceList from './InvoiceList';
import ClientList from './ClientList';

interface DashboardProps {
}

const Dashboard: React.FC<DashboardProps> = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('invoices').select('*');
        if (data) {
          setInvoices(data);
        } else if (error) {
          setError(error);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
    return () => {
      // cleanup function
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <InvoiceList invoices={invoices} />
      <ClientList clients={clients} />
    </div>
  );
};

export default Dashboard;
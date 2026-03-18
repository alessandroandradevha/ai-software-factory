import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/db';
import InvoiceTemplate from './InvoiceTemplate';
import ClientManagement from './ClientManagement';
import PaymentTracking from './PaymentTracking';

interface Invoice {
  id: number;
  client_id: number;
  payment_id: number;
  total: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
}

interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
}

const Dashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase.from<Invoice>('invoices').select('*');
        if (error) {
          setError(error.message);
        } else {
          setInvoices(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase.from<Client>('clients').select('*');
        if (error) {
          setError(error.message);
        } else {
          setClients(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase.from<Payment>('payments').select('*');
        if (error) {
          setError(error.message);
        } else {
          setPayments(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchInvoices();
    fetchClients();
    fetchPayments();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <InvoiceTemplate invoices={invoices} />
      <ClientManagement clients={clients} />
      <PaymentTracking payments={payments} />
    </div>
  );
};

export default Dashboard;
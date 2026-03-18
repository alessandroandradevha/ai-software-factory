import React from 'react';

interface InvoiceListProps {
  invoices: any[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  return (
    <div>
      {invoices.map((invoice) => (
        <div key={invoice.id}>{invoice.name}</div>
      ))}
    </div>
  );
};

export default InvoiceList;
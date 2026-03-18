import React from 'react';

interface ClientListProps {
  clients: any[];
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  return (
    <div>
      {clients.map((client) => (
        <div key={client.id}>{client.name}</div>
      ))}
    </div>
  );
};

export default ClientList;
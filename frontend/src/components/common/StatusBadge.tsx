import React from 'react';
import { DeclarationStatus } from '../../types';

interface StatusBadgeProps {
  status: DeclarationStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  let label = '';

  switch (status) {
    case DeclarationStatus.PENDING:
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'Pending';
      break;
    case DeclarationStatus.VALIDATED:
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Validated';
      break;
    case DeclarationStatus.REJECTED:
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Rejected';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
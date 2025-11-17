
import React from 'react';
import { SessionStatus, HomeworkStatus } from '../../types';

interface BadgeProps {
  status: SessionStatus | HomeworkStatus;
}

const statusColors: Record<SessionStatus | HomeworkStatus, string> = {
  [SessionStatus.Scheduled]: 'bg-blue-100 text-blue-800',
  [SessionStatus.Completed]: 'bg-green-100 text-green-800',
  [SessionStatus.Cancelled]: 'bg-gray-100 text-gray-800',
  [SessionStatus.Missed]: 'bg-red-100 text-red-800',
  [HomeworkStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [HomeworkStatus.Submitted]: 'bg-indigo-100 text-indigo-800',
  [HomeworkStatus.Checked]: 'bg-teal-100 text-teal-800',
};

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[status]}`}>
      {status}
    </span>
  );
};


import React, { useState, useEffect } from 'react';
import { Homework, HomeworkStatus } from '../../types';
import { Button } from '../ui/Button';

interface UpdateHomeworkFormProps {
  homework: Homework;
  onSave: (updatedHomework: Homework) => void;
  onCancel: () => void;
}

export const UpdateHomeworkForm: React.FC<UpdateHomeworkFormProps> = ({ homework, onSave, onCancel }) => {
  const [status, setStatus] = useState(homework.status);
  const [notes, setNotes] = useState(homework.notes);

  useEffect(() => {
    setStatus(homework.status);
    setNotes(homework.notes);
  }, [homework]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...homework, status, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="font-medium text-slate-800">{homework.description}</p>
        <p className="text-sm text-slate-500">Due: {new Date(homework.dueDate).toLocaleDateString()}</p>
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as HomeworkStatus)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          {Object.values(HomeworkStatus).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Add optional notes..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

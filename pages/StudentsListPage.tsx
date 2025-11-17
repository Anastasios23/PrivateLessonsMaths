
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusCircleIcon, ChevronRightIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';

export const StudentsListPage: React.FC = () => {
  const { students, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading students...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Students</h2>
        <Button>
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Student
        </Button>
      </div>
      
      <div className="mb-4">
        <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-slate-200">
            {filteredStudents.map(student => (
              <li
                key={student.id}
                onClick={() => navigate(`/students/${student.id}`)}
                className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold mr-4">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                        <p className="text-sm text-slate-500">{student.subject} - {student.level}</p>
                    </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-slate-400" />
              </li>
            ))}
          </ul>
          {filteredStudents.length === 0 && (
            <div className="text-center p-8 text-slate-500">
                <p>No students found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

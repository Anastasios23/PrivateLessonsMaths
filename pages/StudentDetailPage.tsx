
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { Student, Session, Homework, ProgressNote } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { UpdateHomeworkForm } from '../components/forms/UpdateHomeworkForm';
import { PencilIcon } from '../components/icons';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? 'bg-primary-500 text-white'
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    {children}
  </button>
);

const SessionList: React.FC<{ sessions: Session[] }> = ({ sessions }) => (
  <div className="space-y-4">
    {sessions.sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()).map(s => (
      <Card key={s.id}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{new Date(s.dateTime).toLocaleDateString()}</p>
              <p className="text-sm text-slate-500">{s.topicsCovered}</p>
            </div>
            <Badge status={s.status} />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const HomeworkList: React.FC<{ homework: Homework[], onEdit: (homework: Homework) => void }> = ({ homework, onEdit }) => (
    <div className="space-y-4">
        {homework.sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).map(h => (
            <Card key={h.id}>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <p className="font-semibold text-slate-800">{h.description}</p>
                            <p className="text-sm text-slate-500">Due: {new Date(h.dueDate).toLocaleDateString()}</p>
                            {h.notes && <p className="text-xs italic text-slate-600 mt-1">Notes: {h.notes}</p>}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge status={h.status} />
                            <Button variant="ghost" size="sm" onClick={() => onEdit(h)} aria-label={`Update ${h.description}`}>
                                <PencilIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const ProgressNotesList: React.FC<{ notes: ProgressNote[] }> = ({ notes }) => (
    <div className="space-y-4">
        {notes.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(n => (
            <Card key={n.id}>
                <CardHeader>
                    <CardTitle>{new Date(n.date).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-700">{n.summary}</p>
                    <div className="mt-4">
                        <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Next Steps</h4>
                        <p className="text-sm text-slate-600">{n.nextSteps}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

type Tab = 'sessions' | 'homework' | 'progress';

export const StudentDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { students, sessions, homework, progressNotes, loading, updateHomework } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('sessions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  const student = students.find(s => s.id === studentId);
  const studentSessions = sessions.filter(s => s.studentId === studentId);
  const studentHomework = homework.filter(h => h.studentId === studentId);
  const studentProgressNotes = progressNotes.filter(n => n.studentId === studentId);

  const handleOpenModal = (homeworkItem: Homework) => {
    setSelectedHomework(homeworkItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedHomework(null);
    setIsModalOpen(false);
  };

  const handleSaveHomework = async (updatedHomework: Homework) => {
    await updateHomework(updatedHomework);
    handleCloseModal();
  };


  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found.</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Link to="/students" className="text-sm text-primary-500 hover:underline mb-2 block">&larr; Back to all students</Link>
            <h2 className="text-3xl font-bold text-slate-800">{student.name}</h2>
            <p className="text-slate-500">{student.subject} - {student.level}</p>
          </div>
          <Button>Edit Student</Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600">{student.notes}</p>
          </CardContent>
        </Card>
        
        <div className="flex space-x-2 border-b border-slate-200 pb-2">
          <TabButton active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')}>Sessions</TabButton>
          <TabButton active={activeTab === 'homework'} onClick={() => setActiveTab('homework')}>Homework</TabButton>
          <TabButton active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress Notes</TabButton>
        </div>
        
        <div>
          {activeTab === 'sessions' && <SessionList sessions={studentSessions} />}
          {activeTab === 'homework' && <HomeworkList homework={studentHomework} onEdit={handleOpenModal} />}
          {activeTab === 'progress' && <ProgressNotesList notes={studentProgressNotes} />}
        </div>
      </div>

      {selectedHomework && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Update Homework Status">
          <UpdateHomeworkForm
            homework={selectedHomework}
            onSave={handleSaveHomework}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </>
  );
};

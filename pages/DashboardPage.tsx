
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';
import { Session, Homework, Student } from '../types';
import { isToday, isFuture, parseISO } from 'date-fns';
import { Badge } from '../components/ui/Badge';
import { ClockIcon, CalendarIcon, ClipboardCheckIcon, UsersIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';

const UpcomingSessions: React.FC<{ sessions: Session[], students: Student[] }> = ({ sessions, students }) => {
  const navigate = useNavigate();
  const todaySessions = sessions
    .filter(s => isToday(parseISO(s.dateTime)))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Unknown';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {todaySessions.length > 0 ? (
          <ul className="space-y-4">
            {todaySessions.map(session => (
              <li key={session.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/students/${session.studentId}`)}>
                <div className="bg-primary-100 text-primary-600 p-2 rounded-full">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{getStudentName(session.studentId)}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(session.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {session.topicsCovered}
                  </p>
                </div>
                <div className="ml-auto">
                    <Badge status={session.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">No sessions scheduled for today.</p>
        )}
      </CardContent>
    </Card>
  );
};

const HomeworkDue: React.FC<{ homework: Homework[], students: Student[] }> = ({ homework, students }) => {
    const navigate = useNavigate();
    const dueSoon = homework
        .filter(h => h.status !== 'Checked' && isFuture(parseISO(h.dueDate)))
        .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Unknown';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Homework Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
                {dueSoon.length > 0 ? (
                    <ul className="space-y-4">
                        {dueSoon.map(hw => (
                            <li key={hw.id} className="flex items-start space-x-4 p-2 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/students/${hw.studentId}`)}>
                                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mt-1">
                                    <ClipboardCheckIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{getStudentName(hw.studentId)}</p>
                                    <p className="text-sm text-slate-600">{hw.description}</p>
                                    <p className="text-xs text-slate-500">Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div className="ml-auto pt-1">
                                    <Badge status={hw.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500">No homework due soon.</p>
                )}
            </CardContent>
        </Card>
    )
}

const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode}> = ({title, value, icon}) => {
    return (
        <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-primary-100 text-primary-500 mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-semibold text-slate-800">{value}</p>
            </div>
        </Card>
    )
}

export const DashboardPage: React.FC = () => {
  const { students, sessions, homework, loading } = useAppContext();
  
  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Active Students" value={students.length} icon={<UsersIcon />} />
        <StatCard title="Sessions This Week" value={sessions.filter(s => new Date(s.dateTime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} icon={<CalendarIcon />} />
        <StatCard title="Pending Homework" value={homework.filter(h => h.status === 'Pending').length} icon={<ClipboardCheckIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingSessions sessions={sessions} students={students} />
        <HomeworkDue homework={homework} students={students} />
      </div>
    </div>
  );
};

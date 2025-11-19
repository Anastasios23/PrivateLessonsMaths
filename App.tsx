import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, AppContext } from "./contexts/AppContext";
import { Layout } from "./components/layout/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { StudentsListPage } from "./pages/StudentsListPage";
import { StudentDetailPage } from "./pages/StudentDetailPage";
import { StudentLessonsPage } from "./pages/StudentLessonsPage";
import { StudentHomeworkPage } from "./pages/StudentHomeworkPage";
import { StudentGradesPage } from "./pages/StudentGradesPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuthPage } from "./pages/AuthPage";
import { useAppContext } from "./hooks/useAppContext";
import { SignUpPage } from "./pages/SignUpPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { CalendarPage } from "./pages/CalendarPage";
import { HomeworkDashboardPage } from "./pages/HomeworkDashboardPage";
import { GradesPage } from "./pages/GradesPage";

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <AuthPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <SignUpPage />}
      />
      <Route
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to="/" /> : <ForgotPasswordPage />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/students"
        element={
          <PrivateRoute>
            <Layout>
              <StudentsListPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/students/:studentId"
        element={
          <PrivateRoute>
            <Layout>
              <StudentDetailPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/students/:studentId/lessons"
        element={
          <PrivateRoute>
            <Layout>
              <StudentLessonsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/students/:studentId/homework"
        element={
          <PrivateRoute>
            <Layout>
              <StudentHomeworkPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/students/:studentId/grades"
        element={
          <PrivateRoute>
            <Layout>
              <StudentGradesPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute>
            <Layout>
              <CalendarPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/homework"
        element={
          <PrivateRoute>
            <Layout>
              <HomeworkDashboardPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/grades"
        element={
          <PrivateRoute>
            <Layout>
              <GradesPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}

export default App;

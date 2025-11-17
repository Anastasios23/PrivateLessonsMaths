import React, { useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { AddStudentForm } from "../components/forms/AddStudentForm";
import { PlusCircleIcon, ChevronRightIcon } from "../components/icons";
import { useNavigate } from "react-router-dom";
import { Student } from "../types";

export const StudentsListPage: React.FC = () => {
  const { students, loading, createStudent } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !filterLevel || student.schoolYear === filterLevel;
    return matchesSearch && matchesLevel;
  });

  // Get unique levels for filter
  const uniqueLevels = Array.from(new Set(students.map((s) => s.schoolYear)));

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateStudent = async (
    studentData: Omit<Student, "id" | "createdAt">
  ) => {
    try {
      await createStudent(studentData);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create student:", error);
    }
  };

  if (loading) return <div>Loading students...</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-slate-800">Students</h2>
          <Button onClick={handleOpenModal}>
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />

          {uniqueLevels.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterLevel("")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterLevel === ""
                    ? "bg-primary-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {uniqueLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterLevel === level
                      ? "bg-primary-500 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Students List */}
        <Card>
          <CardContent className="p-0">
            {filteredStudents.length === 0 ? (
              <div className="text-center p-8 text-slate-500">
                <p>
                  {students.length === 0
                    ? 'No students yet. Click "Add Student" to get started.'
                    : "No students match your search criteria."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {filteredStudents.map((student) => (
                  <li
                    key={student.id}
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold mr-4">
                        {student.fullName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">
                          {student.fullName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {student.subject} • {student.schoolYear}
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-slate-400" />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="text-sm text-slate-500">
          {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Student"
      >
        <AddStudentForm
          onSave={handleCreateStudent}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

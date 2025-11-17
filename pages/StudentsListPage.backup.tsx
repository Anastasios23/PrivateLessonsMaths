import React, { useState, useMemo } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { AddStudentForm } from "../components/forms/AddStudentForm";
import { PlusCircleIcon, ChevronRightIcon, UsersIcon, PencilIcon, TrashIcon } from "../components/icons";
import { useNavigate } from "react-router-dom";
import { Student } from "../types";

type ViewMode = "list" | "card";

interface GroupEditModal {
  studentId: string;
  studentName: string;
  currentGroup: string;
}

export const StudentsListPage: React.FC = () => {
  const { students, loading, createStudent, updateStudent, deleteStudent } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterLevel, setFilterLevel] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupEditModal, setGroupEditModal] = useState<GroupEditModal | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const navigate = useNavigate();

  // Get all unique groups
  const allGroups = useMemo(() => {
    const groups = new Set(students.filter((s) => s.group).map((s) => s.group!));
    return Array.from(groups).sort();
  }, [students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup =
        filterGroup === "all" ||
        (filterGroup === "unassigned" && !student.group) ||
        student.group === filterGroup;

      const matchesLevel = !filterLevel || student.schoolYear === filterLevel;

      return matchesSearch && matchesGroup && matchesLevel;
    });
  }, [students, searchTerm, filterGroup, filterLevel]);

  // Get unique levels for filter
  const uniqueLevels = useMemo(
    () => Array.from(new Set(students.map((s) => s.schoolYear))),
    [students]
  );

  // Group students by class for display
  const studentsByGroup = useMemo(() => {
    const grouped: { [key: string]: Student[] } = {};
    filteredStudents.forEach((student) => {
      const group = student.group || "Unassigned";
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(student);
    });
    return Object.entries(grouped).sort((a) => (a[0] === "Unassigned" ? 1 : -1));
  }, [filteredStudents]);

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

  const handleEditGroup = (student: Student) => {
    setGroupEditModal({
      studentId: student.id,
      studentName: student.fullName,
      currentGroup: student.group || "",
    });
    setNewGroupName(student.group || "");
  };

  const handleSaveGroup = async () => {
    if (!groupEditModal) return;

    try {
      const students_data = students.find((s) => s.id === groupEditModal.studentId);
      if (students_data) {
        await updateStudent(groupEditModal.studentId, {
          ...students_data,
          group: newGroupName.trim() || undefined,
        });
      }
      setGroupEditModal(null);
      setNewGroupName("");
    } catch (error) {
      console.error("Failed to update group:", error);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(studentId);
      } catch (error) {
        console.error("Failed to delete student:", error);
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading students...</div>;

  const stats = {
    total: students.length,
    groups: allGroups.length,
    unassigned: students.filter((s) => !s.group).length,
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">👥 Students</h1>
            <p className="text-slate-600">
              {stats.total} students • {stats.groups} groups
            </p>
          </div>
          <Button onClick={handleOpenModal} className="flex items-center gap-2">
            <PlusCircleIcon className="h-5 w-5" />
            Add Student
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Students</p>
            <p className="text-3xl font-bold text-sky-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Groups/Classes</p>
            <p className="text-3xl font-bold text-purple-600">{stats.groups}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Unassigned</p>
            <p className="text-3xl font-bold text-orange-600">{stats.unassigned}</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "card"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              📇 Card View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              📋 List View
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          {/* Group Filter Tabs */}
          <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
            <button
              onClick={() => setFilterGroup("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterGroup === "all"
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Students
            </button>
            {allGroups.map((group) => (
              <button
                key={group}
                onClick={() => setFilterGroup(group)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterGroup === group
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {group}
              </button>
            ))}
            {stats.unassigned > 0 && (
              <button
                onClick={() => setFilterGroup("unassigned")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterGroup === "unassigned"
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Unassigned ({stats.unassigned})
              </button>
            )}
          </div>

          {/* School Year Filter */}
          {uniqueLevels.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterLevel("")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterLevel === ""
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Levels
              </button>
              {uniqueLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterLevel === level
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Display */}
        {filteredStudents.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 rounded-lg border border-slate-200">
            <UsersIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-lg">
              {students.length === 0
                ? 'No students yet. Click "Add Student" to get started.'
                : "No students match your search criteria."}
            </p>
          </div>
        ) : viewMode === "card" ? (
          // Card View - Grouped by Class
          <div className="space-y-8">
            {studentsByGroup.map(([group, groupStudents]) => (
              <div key={group} className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 text-sky-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{group}</h3>
                  <span className="ml-auto text-sm font-medium text-slate-500">
                    {groupStudents.length} student{groupStudents.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupStudents.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-semibold text-slate-800 truncate hover:text-sky-600"
                              onClick={() => navigate(`/student/${student.id}`)}
                            >
                              {student.fullName}
                            </p>
                            <p className="text-xs text-slate-500">{student.subject}</p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroup(student);
                            }}
                            className="p-1 hover:bg-sky-100 rounded text-sky-600"
                            title="Edit group"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStudent(student.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Badge for Level */}
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="inline-block px-2 py-1 bg-sky-50 text-sky-700 text-xs font-medium rounded-full border border-sky-200">
                          {student.schoolYear}
                        </span>
                        {student.level && (
                          <span className="inline-block px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                            {student.level}
                          </span>
                        )}
                      </div>

                      {/* Goals Preview */}
                      {student.goals.length > 0 && (
                        <div className="text-xs text-slate-600 mb-3 line-clamp-2">
                          <strong>Goal:</strong> {student.goals[0]}
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="text-xs text-slate-500 space-y-1 pt-3 border-t border-slate-100">
                        {student.contactParent.email && (
                          <div>📧 {student.contactParent.email}</div>
                        )}
                        {student.contactParent.phone && (
                          <div>📱 {student.contactParent.phone}</div>
                        )}
                      </div>

                      {/* Click to view */}
                      <button
                        onClick={() => navigate(`/student/${student.id}`)}
                        className="mt-3 w-full text-center py-2 bg-sky-50 hover:bg-sky-100 text-sky-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        View Profile
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="space-y-0">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 hover:bg-sky-50 cursor-pointer border-b border-slate-200 last:border-b-0 flex items-center justify-between group transition-colors"
                  onClick={() => navigate(`/student/${student.id}`)}
                >
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold mr-4 shadow-md">
                      {student.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{student.fullName}</p>
                      <p className="text-sm text-slate-500">
                        {student.subject} • {student.schoolYear}
                        {student.group && ` • ${student.group}`}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-3">
                    {student.level && (
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                        {student.level}
                      </span>
                    )}
                    {student.group && (
                      <span className="px-3 py-1 bg-sky-50 text-sky-700 text-xs font-medium rounded-full border border-sky-200">
                        {student.group}
                      </span>
                    )}

                    {/* Action Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGroup(student);
                        }}
                        className="p-2 hover:bg-sky-100 rounded text-sky-600"
                        title="Edit group"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudent(student.id);
                        }}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <ChevronRightIcon className="h-5 w-5 text-slate-400 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="text-sm text-slate-500 text-center">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Student">
        <AddStudentForm onSave={handleCreateStudent} onCancel={handleCloseModal} />
      </Modal>

      {/* Edit Group Modal */}
      {groupEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              Assign Group/Class
            </h2>
            <p className="text-sm text-slate-600">
              Student: <strong>{groupEditModal.studentName}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Group/Class Name
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Group A, Class 2024, Advanced"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Suggestions */}
              {allGroups.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    Existing groups:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allGroups.map((group) => (
                      <button
                        key={group}
                        onClick={() => setNewGroupName(group)}
                        className="px-3 py-1 bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 text-xs font-medium rounded-full transition-colors"
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setNewGroupName("");
                  setGroupEditModal(null);
                }}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                Clear Group
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setGroupEditModal(null);
                  setNewGroupName("");
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGroup}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentsListPage;

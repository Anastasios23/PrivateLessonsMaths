import React, { useState, useMemo } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { AddStudentForm } from "../components/forms/AddStudentForm";
import {
  PlusCircleIcon,
  ChevronRightIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
} from "../components/icons";
import { useNavigate } from "react-router-dom";
import { Student } from "../types";

type ViewMode = "list" | "card";

interface GroupManagementModal {
  studentId: string;
  studentName: string;
  currentGroups: string[];
}

export const StudentsListPage: React.FC = () => {
  const {
    students,
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
    groups,
    createGroup,
    deleteGroup,
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterLevel, setFilterLevel] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupModal, setGroupModal] = useState<GroupManagementModal | null>(
    null
  );
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupInput, setNewGroupInput] = useState("");
  const [selectedGroupsInModal, setSelectedGroupsInModal] = useState<string[]>(
    []
  );
  const [groupError, setGroupError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    groupName: string;
    studentCount: number;
  } | null>(null);
  const navigate = useNavigate();

  // Get all unique groups (from context + students)
  const allGroups = useMemo(() => {
    const groupSet = new Set<string>(groups);
    students.forEach((s) => {
      if (s.groups && Array.isArray(s.groups)) {
        s.groups.forEach((g) => groupSet.add(g));
      }
    });
    return Array.from(groupSet).sort();
  }, [groups, students]);

  // Get students count by group
  const groupCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    students.forEach((s) => {
      if (s.groups && Array.isArray(s.groups)) {
        s.groups.forEach((group) => {
          counts[group] = (counts[group] || 0) + 1;
        });
      }
    });
    return counts;
  }, [students]);

  // Filter students based on group, search, and level
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup =
        filterGroup === "all" ||
        (filterGroup === "unassigned" &&
          (!student.groups || student.groups.length === 0)) ||
        (student.groups && student.groups.includes(filterGroup));

      const matchesLevel = !filterLevel || student.schoolYear === filterLevel;

      return matchesSearch && matchesGroup && matchesLevel;
    });
  }, [students, searchTerm, filterGroup, filterLevel]);

  // Group students by class for card view
  const studentsByGroup = useMemo(() => {
    const grouped: { [key: string]: Student[] } = {};

    if (filterGroup !== "all") {
      // If filtering by group, show only that group
      if (filterGroup === "unassigned") {
        grouped["Unassigned"] = filteredStudents.filter(
          (s) => !s.groups || s.groups.length === 0
        );
      } else {
        grouped[filterGroup] = filteredStudents.filter(
          (s) => s.groups && s.groups.includes(filterGroup)
        );
      }
    } else {
      // Show all groups
      allGroups.forEach((group) => {
        grouped[group] = filteredStudents.filter(
          (s) => s.groups && s.groups.includes(group)
        );
      });

      // Add unassigned
      const unassigned = filteredStudents.filter(
        (s) => !s.groups || s.groups.length === 0
      );
      if (unassigned.length > 0) {
        grouped["Unassigned"] = unassigned;
      }
    }

    return Object.entries(grouped)
      .filter(([, students]) => students.length > 0)
      .sort((a) => (a[0] === "Unassigned" ? 1 : -1));
  }, [filteredStudents, allGroups, filterGroup]);

  const uniqueLevels = useMemo(
    () => Array.from(new Set(students.map((s) => s.schoolYear))),
    [students]
  );

  const stats = {
    total: students.length,
    groups: allGroups.length,
    unassigned: students.filter((s) => !s.groups || s.groups.length === 0)
      .length,
  };

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

  const handleEditGroups = (student: Student) => {
    setGroupModal({
      studentId: student.id,
      studentName: student.fullName,
      currentGroups: student.groups || [],
    });
    setSelectedGroupsInModal(student.groups || []);
  };

  const handleSaveGroups = async () => {
    if (!groupModal) return;

    try {
      const student = students.find((s) => s.id === groupModal.studentId);
      if (student) {
        await updateStudent(groupModal.studentId, {
          ...student,
          groups:
            selectedGroupsInModal.length > 0
              ? selectedGroupsInModal
              : undefined,
        });
      }
      setGroupModal(null);
      setSelectedGroupsInModal([]);
    } catch (error) {
      console.error("Failed to update groups:", error);
    }
  };

  const handleToggleGroupInModal = (group: string) => {
    setSelectedGroupsInModal((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
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

  const handleCreateNewGroup = async () => {
    try {
      setGroupError("");
      if (!newGroupInput.trim()) {
        setGroupError("Group name cannot be empty");
        return;
      }
      await createGroup(newGroupInput.trim());
      setNewGroupInput("");
      setShowCreateGroup(false);
    } catch (error: any) {
      setGroupError(error.message || "Failed to create group");
    }
  };

  const handleDeleteGroup = (groupName: string) => {
    const studentCount = students.filter(
      (s) => s.groups && s.groups.includes(groupName)
    ).length;
    setDeleteConfirm({ groupName, studentCount });
  };

  const handleConfirmDeleteGroup = async () => {
    if (!deleteConfirm) return;
    try {
      setGroupError("");
      await deleteGroup(deleteConfirm.groupName);
      setDeleteConfirm(null);
    } catch (error: any) {
      setGroupError(error.message || "Failed to delete group");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Loading students...</div>
    );

  return (
    <>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              👥 Students
            </h1>
            <p className="text-slate-600">
              {stats.total} students • {stats.groups} groups
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateGroup(!showCreateGroup)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5" />
              New Group
            </button>
            <Button
              onClick={handleOpenModal}
              className="flex items-center gap-2"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Create Group Panel */}
        {showCreateGroup && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-purple-900">Create New Group</h3>
            {groupError && (
              <div className="p-2 bg-red-100 text-red-700 text-sm rounded border border-red-300">
                {groupError}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroupInput}
                onChange={(e) => setNewGroupInput(e.target.value)}
                placeholder="Enter group name (e.g., Group A, Advanced Class)"
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateNewGroup();
                  }
                }}
              />
              <button
                onClick={handleCreateNewGroup}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateGroup(false);
                  setNewGroupInput("");
                  setGroupError("");
                }}
                className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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
            <p className="text-3xl font-bold text-orange-600">
              {stats.unassigned}
            </p>
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
              <div key={group} className="relative group">
                <button
                  onClick={() => setFilterGroup(group)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filterGroup === group
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {group} ({groupCounts[group] || 0})
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGroup(group);
                  }}
                  className="absolute top-0 right-0 hidden group-hover:block transform translate-x-1 -translate-y-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  title="Delete group"
                >
                  ×
                </button>
              </div>
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
                    {groupStudents.length} student
                    {groupStudents.length !== 1 ? "s" : ""}
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
                              onClick={() =>
                                navigate(`/students/${student.id}`)
                              }
                            >
                              {student.fullName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {student.subject}
                            </p>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroups(student);
                            }}
                            className="p-1 hover:bg-sky-100 rounded text-sky-600"
                            title="Manage groups"
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

                      {/* Badges for groups */}
                      {student.groups && student.groups.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {student.groups.map((g) => (
                            <span
                              key={g}
                              className="inline-block px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Badge for Level */}
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="inline-block px-2 py-1 bg-sky-50 text-sky-700 text-xs font-medium rounded-full border border-sky-200">
                          {student.schoolYear}
                        </span>
                        {student.level && (
                          <span className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
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
                        onClick={() => navigate(`/students/${student.id}`)}
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
                  onClick={() => navigate(`/students/${student.id}`)}
                >
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold mr-4 shadow-md">
                      {student.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        {student.fullName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {student.subject} • {student.schoolYear}
                      </p>
                      {student.groups && student.groups.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {student.groups.map((g) => (
                            <span
                              key={g}
                              className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-3">
                    {student.level && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                        {student.level}
                      </span>
                    )}

                    {/* Action Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGroups(student);
                        }}
                        className="p-2 hover:bg-sky-100 rounded text-sky-600"
                        title="Manage groups"
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

      {/* Group Management Modal */}
      {groupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 my-8">
            <h2 className="text-xl font-bold text-slate-800">Manage Groups</h2>
            <p className="text-sm text-slate-600">
              Student: <strong>{groupModal.studentName}</strong>
            </p>

            <div className="bg-slate-50 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
              <p className="text-sm font-medium text-slate-700">
                Select groups (student can be in multiple groups):
              </p>

              <div className="space-y-2">
                {allGroups.length > 0 ? (
                  allGroups.map((group) => (
                    <label
                      key={group}
                      className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroupsInModal.includes(group)}
                        onChange={() => handleToggleGroupInModal(group)}
                        className="w-4 h-4 text-sky-600 rounded focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="text-slate-700 font-medium">
                        {group}
                      </span>
                      <span className="text-xs text-slate-500 ml-auto">
                        ({groupCounts[group] || 0} students)
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    No groups exist yet. Create one first!
                  </p>
                )}
              </div>
            </div>

            {/* Selected Groups Preview */}
            {selectedGroupsInModal.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Selected groups:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedGroupsInModal.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium"
                    >
                      {g}
                      <button
                        onClick={() =>
                          setSelectedGroupsInModal(
                            selectedGroupsInModal.filter((x) => x !== g)
                          )
                        }
                        className="text-sky-700 hover:text-sky-900 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Create New Group in Modal */}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <p className="text-xs font-medium text-slate-600">
                Or create a new group:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New group name"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const groupName = e.currentTarget.value.trim();
                      if (
                        !selectedGroupsInModal.includes(groupName) &&
                        !allGroups.includes(groupName)
                      ) {
                        setSelectedGroupsInModal([
                          ...selectedGroupsInModal,
                          groupName,
                        ]);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    if (input.value.trim()) {
                      const groupName = input.value.trim();
                      if (
                        !selectedGroupsInModal.includes(groupName) &&
                        !allGroups.includes(groupName)
                      ) {
                        setSelectedGroupsInModal([
                          ...selectedGroupsInModal,
                          groupName,
                        ]);
                        input.value = "";
                      }
                    }
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setGroupModal(null);
                  setSelectedGroupsInModal([]);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGroups}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Delete Group?
              </h2>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <p className="text-slate-700">
                You are about to delete the group{" "}
                <strong>"{deleteConfirm.groupName}"</strong>
              </p>
              {deleteConfirm.studentCount > 0 && (
                <div className="bg-white border border-red-200 rounded p-3">
                  <p className="text-sm text-slate-600">
                    📌 <strong>{deleteConfirm.studentCount}</strong> student
                    {deleteConfirm.studentCount !== 1 ? "s" : ""} will be
                    removed from this group
                  </p>
                </div>
              )}
              <p className="text-sm text-red-700">
                ❌ This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteGroup}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentsListPage;

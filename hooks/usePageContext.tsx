import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppContext } from "./useAppContext";
import { ContextMenuItem } from "../components/layout/LocalContextMenu";
import {
  HomeIcon,
  CalendarIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
} from "../components/icons";

export const usePageContext = (): {
  contextMenu?: {
    title?: string;
    subtitle?: string;
    items: ContextMenuItem[];
  };
} => {
  const location = useLocation();
  const { studentId } = useParams<{ studentId: string }>();
  const { students } = useAppContext();

  // Student Detail Page Context
  if (location.pathname.includes("/students/") && studentId) {
    const student = students.find((s) => s.id === studentId);
    return {
      contextMenu: {
        title: student?.fullName,
        subtitle: `${student?.subject} • ${student?.schoolYear || "Unknown"}`,
        items: [
          {
            id: "overview",
            label: "Overview",
            path: `/students/${studentId}`,
            icon: <HomeIcon className="h-4 w-4" />,
          },
          {
            id: "lessons",
            label: "Lessons",
            path: `/students/${studentId}/lessons`,
            icon: <CalendarIcon className="h-4 w-4" />,
          },
          {
            id: "homework",
            label: "Homework",
            path: `/students/${studentId}/homework`,
            icon: <BookOpenIcon className="h-4 w-4" />,
          },
          {
            id: "grades",
            label: "Grades",
            path: `/students/${studentId}/grades`,
            icon: <ClipboardCheckIcon className="h-4 w-4" />,
          },
        ],
      },
    };
  }

  return {};
};

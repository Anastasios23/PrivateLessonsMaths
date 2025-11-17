# Student Profiles - Developer Quick Start

## Overview

This guide helps developers understand and extend the student profile system.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    React Components                  │
├─────────────────────────────────────────────────────┤
│  StudentsListPage    │   StudentDetailPage           │
│  (Browse)            │   (Profile + Tabs)            │
│  - Search            │   - Overview                  │
│  - Filter            │   - Sessions                  │
│  - Add modal         │   - Homework                  │
│                      │   - Progress                  │
├─────────────────────────────────────────────────────┤
│           AppContext (State Management)              │
│  - students state    │  - createStudent()            │
│  - sessions state    │  - updateStudent()            │
│  - homework state    │  - deleteStudent()            │
├─────────────────────────────────────────────────────┤
│        Services Layer (Data Operations)              │
│           studentsService.ts                         │
│  - getStudents()     │  - updateStudent()            │
│  - getStudentById()  │  - deleteStudent()            │
│  - createStudent()   │                               │
├─────────────────────────────────────────────────────┤
│      Persistence Layer (Storage Backend)             │
│           localStorage (v1)                          │
│      (Replace with API calls in v2+)                 │
└─────────────────────────────────────────────────────┘
```

---

## Key Files Reference

| File                                   | Purpose          | Status                                  |
| -------------------------------------- | ---------------- | --------------------------------------- |
| `types.ts`                             | Type definitions | ✅ Enhanced with Student, ParentContact |
| `constants.ts`                         | Mock data        | ✅ Updated with new Student structure   |
| `contexts/AppContext.tsx`              | Global state     | ✅ Added CRUD methods                   |
| `services/studentsService.ts`          | Data layer       | ✨ NEW - localStorage operations        |
| `components/forms/AddStudentForm.tsx`  | Create form      | ✨ NEW                                  |
| `components/forms/EditStudentForm.tsx` | Edit form        | ✨ NEW                                  |
| `pages/StudentsListPage.tsx`           | List view        | ✅ Enhanced with modals                 |
| `pages/StudentDetailPage.tsx`          | Profile view     | ✅ Enhanced with tabs & sections        |
| `components/icons.tsx`                 | Icon components  | ✅ Added TrashIcon                      |

---

## Data Flow Diagram

### Create Student Flow

```
AddStudentForm
    ↓ (onSave)
StudentsListPage
    ↓ (handleCreateStudent)
AppContext.createStudent()
    ↓
studentsService.createStudent()
    ↓
localStorage.setItem()
    ↓
AppContext updates state
    ↓
Component re-renders
```

### Update Student Flow

```
StudentDetailPage
    ↓ (Edit button)
EditStudentForm (modal)
    ↓ (onSave)
AppContext.updateStudent()
    ↓
studentsService.updateStudent()
    ↓
localStorage.setItem()
    ↓
AppContext updates state
    ↓
Component re-renders
```

### Delete Student Flow

```
StudentDetailPage
    ↓ (Delete button)
Confirmation Modal
    ↓ (handleDeleteStudent)
AppContext.deleteStudent()
    ↓
studentsService.deleteStudent()
    ↓
localStorage.removeItem()
    ↓
AppContext updates state
    ↓
Navigate to /students
```

---

## How to Extend

### Add a New Student Field

1. **Update types.ts:**

   ```typescript
   export interface Student {
     // ... existing fields
     newField: string; // Add here
   }
   ```

2. **Update constants.ts mock data:**

   ```typescript
   {
     // ... existing fields
     newField: 'value',  // Add to each mock student
   }
   ```

3. **Update forms:**

   ```typescript
   // In AddStudentForm.tsx and EditStudentForm.tsx
   const [newField, setNewField] = useState("");

   // In form JSX:
   <input value={newField} onChange={(e) => setNewField(e.target.value)} />;

   // In submission:
   const studentData = {
     // ... existing fields
     newField,
   };
   ```

4. **Display in StudentDetailPage:**
   ```typescript
   // Add to overview card or new section:
   <div>
     <p className="text-sm text-slate-500">New Field Label</p>
     <p className="font-semibold text-slate-800">{student.newField}</p>
   </div>
   ```

### Migrate to API Backend

1. **Create new `services/api/students.ts`:**

   ```typescript
   export const studentsAPI = {
     async getStudents() {
       const response = await fetch("/api/students");
       return response.json();
     },
     async createStudent(data) {
       const response = await fetch("/api/students", {
         method: "POST",
         body: JSON.stringify(data),
       });
       return response.json();
     },
     // ... implement all methods
   };
   ```

2. **Replace import in AppContext:**

   ```typescript
   // Remove this:
   import { studentsService } from "../services/studentsService";

   // Add this:
   import { studentsAPI } from "../services/api/students";
   ```

3. **Update AppContext methods:**

   ```typescript
   const createStudent = async (studentData) => {
     const newStudent = await studentsAPI.createStudent(studentData);
     setStudents((prev) => [...prev, newStudent]);
     return newStudent;
   };
   ```

4. **No changes needed in components!** They work the same way.

### Add Validation

1. **Server-side (v2+):**

   ```typescript
   // In backend API endpoint
   if (!data.fullName || !data.contactParent.email) {
     throw new Error("Validation failed");
   }
   ```

2. **Client-side enhancement:**

   ```typescript
   // In form component
   const [errors, setErrors] = useState({});

   const validate = () => {
     const newErrors = {};
     if (!fullName) newErrors.fullName = "Required";
     // ...
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e) => {
     e.preventDefault();
     if (!validate()) return;
     // proceed with submission
   };
   ```

### Add Filtering/Sorting

1. **In StudentsListPage:**

   ```typescript
   // Add new filter state:
   const [sortBy, setSortBy] = useState("name"); // 'name' | 'startDate'

   // Apply sorting:
   const sorted = [...filteredStudents].sort((a, b) => {
     if (sortBy === "name") {
       return a.fullName.localeCompare(b.fullName);
     } else if (sortBy === "startDate") {
       return new Date(b.startDate) - new Date(a.startDate);
     }
     return 0;
   });
   ```

### Add Student Progress Analytics

1. **Create new hook `hooks/useStudentAnalytics.ts`:**

   ```typescript
   export const useStudentAnalytics = (studentId: string) => {
     const { sessions, homework, progressNotes } = useAppContext();

     const avgSessionsPerMonth = () => {
       // calculate from sessions
     };

     const homeworkCompletionRate = () => {
       // calculate from homework
     };

     return { avgSessionsPerMonth, homeworkCompletionRate };
   };
   ```

2. **Use in StudentDetailPage:**

   ```typescript
   const analytics = useStudentAnalytics(studentId);

   // Display in Overview or new Analytics card
   ```

---

## Testing Utilities

### Mock Student Generator

```typescript
function createMockStudent(overrides = {}) {
  return {
    id: Date.now().toString(),
    tutorId: "tutor1",
    fullName: "Test Student",
    schoolYear: "Grade 10",
    subject: "Mathematics",
    level: "Intermediate",
    goals: ["Pass exam"],
    notes: "Test notes",
    contactParent: {
      name: "Test Parent",
      phone: "+1-555-0000",
      email: "test@example.com",
    },
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
```

### Test Storage Cleanup

```typescript
// In test teardown:
localStorage.removeItem("tutortrack_students");

// Or clear all:
localStorage.clear();
```

---

## Common Implementation Patterns

### Loading State

```typescript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await operation();
  } finally {
    setIsLoading(false);
  }
};

return (
  <button disabled={isLoading}>{isLoading ? "Loading..." : "Action"}</button>
);
```

### Error Handling

```typescript
const [error, setError] = useState("");

try {
  await operation();
  setError("");
} catch (err) {
  setError("Failed to complete action");
  console.error(err);
}

{
  error && <div className="p-3 bg-red-50 text-red-700">{error}</div>;
}
```

### Modal Management

```typescript
const [isOpen, setIsOpen] = useState(false);

const handleOpen = () => setIsOpen(true);
const handleClose = () => setIsOpen(false);

<Modal isOpen={isOpen} onClose={handleClose}>
  {/* Modal content */}
</Modal>;
```

### Form State

```typescript
const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  goals: [""],
});

const handleFieldChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleGoalChange = (index, value) => {
  setFormData((prev) => ({
    ...prev,
    goals: prev.goals.map((g, i) => (i === index ? value : g)),
  }));
};
```

---

## Performance Tips

1. **Use React.memo for list items** (v2):

   ```typescript
   const StudentCard = React.memo(({ student, onClick }) => (
     // Card component
   ));
   ```

2. **Virtualize long lists** (v2+):

   - Use `react-window` for thousands of students

3. **Optimize search**:

   - Debounce search input
   - Use `useMemo` for filtered results

4. **Lazy load details**:
   - Load sessions/homework on demand in StudentDetailPage

---

## Type Safety Tips

1. **Use strict types throughout:**

   ```typescript
   const createStudent = async (data: Omit<Student, "id" | "createdAt">) => {
     // TypeScript ensures all required fields
   };
   ```

2. **Avoid `any` types:**

   ```typescript
   // ❌ Avoid:
   const student: any = {...};

   // ✅ Use:
   const student: Student = {...};
   ```

3. **Use discriminated unions** for complex states (v2):
   ```typescript
   type StudentState =
     | { status: "loading" }
     | { status: "success"; data: Student[] }
     | { status: "error"; error: string };
   ```

---

## Deployment Checklist

- [ ] Update Student type correctly
- [ ] All CRUD operations working in forms
- [ ] Search and filter functional
- [ ] Parent contact fields populated
- [ ] Goals display and edit working
- [ ] Delete confirmation working
- [ ] localStorage persistence working
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] All modals close properly
- [ ] Back navigation works
- [ ] Empty states handle gracefully

---

## Troubleshooting

### Students not persisting after refresh

- Check browser localStorage (`F12` → Application → Storage)
- Verify localStorage key is `tutortrack_students`
- Check for localStorage quota exceeded errors

### Form not submitting

- Check console for errors
- Verify validation is passing
- Ensure `isLoading` state not stuck as `true`
- Check that required fields are filled

### Delete not working

- Verify delete confirmation modal appears
- Check that `deleteStudent` is called
- Verify localStorage item removed
- Check for navigation errors

### Search/filter not working

- Check that filtered values match student data
- Case-sensitive? Use `.toLowerCase()`
- Verify filter conditions are AND (not OR)

---

## Resources

- React docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- TypeScript: https://www.typescriptlang.org
- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Happy coding! 🚀**

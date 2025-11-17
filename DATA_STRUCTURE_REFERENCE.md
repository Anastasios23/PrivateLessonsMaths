# Student Data Structure Reference

## Complete Student Object Example

```typescript
{
  // Unique Identifiers
  id: "1704067200000",              // Timestamp-based or UUID
  tutorId: "tutor1",                 // Reference to tutor

  // Personal Information
  fullName: "Alice Johnson",         // First and last name combined
  schoolYear: "Grade 10",            // e.g., "Grade 10", "Year 9"
  subject: "Mathematics",            // Main subject of instruction
  level: "Intermediate",             // Proficiency level

  // Parent/Guardian Information
  contactParent: {
    name: "Sarah Johnson",           // Parent's name
    phone: "+1-555-0101",            // Contact phone number
    email: "sarah.johnson@email.com" // Contact email
  },

  // Educational Goals
  goals: [
    "Pass June exam with ≥ 80%",
    "Improve algebra skills",
    "Build confidence in geometry"
  ],

  // Notes & Metadata
  notes: "Struggles with algebra, but strong in geometry. Responds well to visual explanations.",

  // Timestamps
  startDate: "2023-09-01T00:00:00.000Z",
  createdAt: "2023-08-15T00:00:00.000Z"
}
```

---

## Field Reference

### Required Fields

| Field                 | Type   | Example            | Purpose                 |
| --------------------- | ------ | ------------------ | ----------------------- |
| `id`                  | string | "1704067200000"    | Unique identifier       |
| `tutorId`             | string | "tutor1"           | Reference to tutor      |
| `fullName`            | string | "Alice Johnson"    | Student name            |
| `schoolYear`          | string | "Grade 10"         | Academic level          |
| `subject`             | string | "Mathematics"      | Subject taught          |
| `level`               | string | "Intermediate"     | Proficiency level       |
| `contactParent.email` | string | "parent@email.com" | Parent email (required) |

### Optional Fields

| Field                 | Type     | Example              | Purpose             |
| --------------------- | -------- | -------------------- | ------------------- |
| `contactParent.name`  | string   | "Sarah Johnson"      | Parent name         |
| `contactParent.phone` | string   | "+1-555-0101"        | Parent phone        |
| `goals`               | string[] | ["Pass exam", "..."] | Learning objectives |
| `notes`               | string   | "Student details..." | Free-form notes     |

### Auto-Generated Fields

| Field       | Type   | Set By  | Purpose              |
| ----------- | ------ | ------- | -------------------- |
| `createdAt` | string | Service | Record creation time |
| `startDate` | string | Form    | When student started |

---

## Type Definition

### TypeScript Interfaces

```typescript
export interface ParentContact {
  name: string;
  phone: string;
  email: string;
}

export interface Student {
  id: string;
  tutorId: string;
  fullName: string;
  schoolYear: string; // e.g., "Grade 10", "Year 9"
  contactParent: ParentContact;
  goals: string[]; // e.g., ["pass exam", "improve skills"]
  subject: string;
  level: string;
  notes: string; // free text notes
  startDate: string; // ISO 8601 timestamp
  createdAt: string; // ISO 8601 timestamp
}

// For create/update operations
type CreateStudentInput = Omit<Student, "id" | "createdAt">;
type UpdateStudentInput = Partial<Student>;
```

---

## localStorage Storage Format

### Key

```
tutortrack_students
```

### Value (JSON Array)

```json
[
  {
    "id": "1",
    "tutorId": "tutor1",
    "fullName": "Alice Johnson",
    "schoolYear": "Grade 10",
    "subject": "Mathematics",
    "level": "Grade 10",
    "goals": ["Pass June exam with ≥ 80%", "Improve algebra skills"],
    "notes": "Struggles with algebra, but strong in geometry.",
    "contactParent": {
      "name": "Sarah Johnson",
      "phone": "+1-555-0101",
      "email": "sarah.johnson@email.com"
    },
    "startDate": "2023-09-01T00:00:00.000Z",
    "createdAt": "2023-08-15T00:00:00.000Z"
  },
  {
    "id": "2",
    "tutorId": "tutor1",
    "fullName": "Ben Carter",
    "schoolYear": "Year 7",
    "subject": "Piano",
    "level": "Beginner",
    "goals": ["Master scales", "Prepare for Grade 2 exam"],
    "notes": "Very enthusiastic and practices regularly.",
    "contactParent": {
      "name": "Michael Carter",
      "phone": "+1-555-0102",
      "email": "michael.carter@email.com"
    },
    "startDate": "2023-10-01T00:00:00.000Z",
    "createdAt": "2023-09-20T00:00:00.000Z"
  }
]
```

---

## API Request/Response Format (v2+)

### Create Student

**Request:**

```http
POST /api/students
Content-Type: application/json

{
  "tutorId": "tutor1",
  "fullName": "New Student",
  "schoolYear": "Grade 10",
  "subject": "Mathematics",
  "level": "Intermediate",
  "goals": ["Pass exam"],
  "notes": "Student notes",
  "contactParent": {
    "name": "Parent Name",
    "phone": "+1-555-0000",
    "email": "parent@email.com"
  },
  "startDate": "2024-01-01T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "new-id-123",
    "tutorId": "tutor1",
    "fullName": "New Student",
    // ... all fields
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### Update Student

**Request:**

```http
PATCH /api/students/:id
Content-Type: application/json

{
  "goals": ["New goal 1", "New goal 2"],
  "notes": "Updated notes"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "student-id"
    // ... updated fields
  }
}
```

### Get All Students

**Request:**

```http
GET /api/students
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      /* Student 1 */
    },
    {
      /* Student 2 */
    }
  ],
  "count": 2
}
```

### Get Student by ID

**Request:**

```http
GET /api/students/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "student-id"
    // ... all fields
  }
}
```

### Delete Student

**Request:**

```http
DELETE /api/students/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Student deleted"
}
```

---

## Common Data Patterns

### School Years (Examples)

```
"Grade 1", "Grade 2", ..., "Grade 12"
"Year 1", "Year 2", ..., "Year 13"
"Primary 1", "Primary 2", ..., "Secondary 3"
"Form 1", "Form 2", ..., "Form 5"
```

### Proficiency Levels (Examples)

```
"Beginner"
"Elementary"
"Intermediate"
"Upper Intermediate"
"Advanced"
"Native Speaker"
```

### Subject Examples

```
"Mathematics"
"English"
"Science"
"History"
"Geography"
"French"
"Spanish"
"Piano"
"Guitar"
"Violin"
"Chess"
```

### Goal Examples

```
"Pass June exam with ≥ 80%"
"Improve algebra skills"
"Master scales and arpeggios"
"Achieve conversational fluency"
"Build confidence in speaking"
"Prepare for university entrance"
"Catch up with peers"
"Maintain current level"
```

### Notes Examples

```
"Responds well to visual explanations"
"Needs motivation and encouragement"
"Struggles with time management"
"Very focused and dedicated"
"Works best with hands-on activities"
"Prefers small group settings"
"Has exam anxiety, needs support"
```

---

## Validation Rules

### Required Fields

- `fullName`: Non-empty string, 2-100 characters
- `contactParent.email`: Valid email format
- `schoolYear`: Non-empty string
- `subject`: Non-empty string
- `tutorId`: Non-empty string (set by system)

### Optional Fields (Default Values)

- `goals`: Empty array `[]` if not provided
- `notes`: Empty string `""` if not provided
- `contactParent.name`: Empty string if not provided
- `contactParent.phone`: Empty string if not provided

### Timestamps

- `startDate`: ISO 8601 string (defaults to current date)
- `createdAt`: ISO 8601 string (auto-generated)

### ID Generation

- `id`: Unique string (v1: timestamp, v2: UUID recommended)

---

## Data Migration Guide

### From Old Format to New

**Old Structure:**

```typescript
{
  id: "1",
  name: "Alice Johnson",           // → fullName
  contactInfo: "alice@email.com",  // → contactParent.email
  subject: "Mathematics",
  level: "Grade 10",               // → schoolYear
  notes: "Some notes",
  startDate: "2023-09-01",
  createdAt: "2023-08-15"
}
```

**New Structure:**

```typescript
{
  id: "1",
  tutorId: "tutor1",
  fullName: "Alice Johnson",
  schoolYear: "Grade 10",
  subject: "Mathematics",
  level: "Grade 10",
  goals: [],
  notes: "Some notes",
  contactParent: {
    name: "",
    phone: "",
    email: "alice@email.com"
  },
  startDate: "2023-09-01T00:00:00.000Z",
  createdAt: "2023-08-15T00:00:00.000Z"
}
```

**Migration Script:**

```typescript
function migrateStudent(oldStudent) {
  return {
    id: oldStudent.id,
    tutorId: "tutor1", // Set to current tutor
    fullName: oldStudent.name,
    schoolYear: oldStudent.level,
    subject: oldStudent.subject,
    level: oldStudent.level,
    goals: [],
    notes: oldStudent.notes,
    contactParent: {
      name: "",
      phone: "",
      email: extractEmail(oldStudent.contactInfo),
    },
    startDate: ensureISO8601(oldStudent.startDate),
    createdAt: ensureISO8601(oldStudent.createdAt),
  };
}
```

---

## Code Examples

### Create Student Object

```typescript
const newStudent: Omit<Student, "id" | "createdAt"> = {
  tutorId: "tutor1",
  fullName: "John Doe",
  schoolYear: "Grade 9",
  subject: "English",
  level: "Intermediate",
  goals: ["Pass GCSE", "Improve writing"],
  notes: "Quick learner, needs practice with essays",
  contactParent: {
    name: "Jane Doe",
    phone: "+44-1234-567890",
    email: "jane@example.com",
  },
  startDate: new Date().toISOString(),
};
```

### Validate Email

```typescript
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### Format Phone

```typescript
function formatPhone(phone: string): string {
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, "");
  // Format as needed
  return cleaned.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}
```

### Extract Unique Years

```typescript
const allStudents: Student[] = [...];
const uniqueYears = Array.from(
  new Set(allStudents.map(s => s.schoolYear))
);
// Result: ["Grade 9", "Grade 10", "Grade 11", ...]
```

---

## Debugging Tips

### Log Student Object

```typescript
console.log("Student:", JSON.stringify(student, null, 2));
```

### Check localStorage

```typescript
// Browser console:
const students = JSON.parse(localStorage.getItem("tutortrack_students"));
console.table(students);
```

### Verify Type

```typescript
function isStudent(obj: any): obj is Student {
  return (
    typeof obj.id === "string" &&
    typeof obj.fullName === "string" &&
    obj.contactParent &&
    Array.isArray(obj.goals)
  );
}
```

---

**Reference Version:** 1.0
**Last Updated:** November 17, 2025

# 👥 Group Management Guide

## Overview

The Students page now supports organizing students into multiple groups/classes. Each student can belong to one or more groups simultaneously.

---

## How to Use

### ✅ Method 1: Create Groups When Adding Students (Recommended)

1. **Click "Add Student" button**

   - Opens the Add Student form modal

2. **Fill in Student Information**

   - Full Name (required)
   - School Year/Level
   - Subject
   - Level
   - Parent Contact Email (required)
   - etc.

3. **Add Groups (Optional)**

   - Scroll down to "Groups / Classes" section
   - Type a group name in the text input (e.g., "Group A", "Advanced Math", "Class 2024")
   - Press **Enter** to add the group
   - Repeat to add multiple groups
   - Remove a group by clicking the **×** button on the group badge

4. **Create Student**
   - Click "Create Student" button
   - Student is now created and assigned to the selected groups!

---

### ✅ Method 2: Edit Existing Student's Groups

1. **Navigate to Students page**

   - Click "👥 Students" in the header

2. **Find the Student**

   - Search by name or subject if needed
   - Filter by existing group

3. **Click the Edit Icon (✏️)**

   - Hover over a student card
   - Click the pencil icon to open "Manage Groups" modal

4. **Manage Groups in Modal**

   - **Check existing groups** to add student to them
   - **Uncheck groups** to remove student from them
   - **Add new group** by:
     - Typing a name in "Or create a new group" input
     - Pressing **Enter** or clicking **Add** button

5. **Save Changes**
   - Click "Save" button
   - Student group assignments are updated!

---

### 📋 Method 3: View Groups

**View by Group:**

- Filter buttons below search show all available groups
- Click a group button to see only students in that group
- "(X)" shows student count in each group

**"Unassigned" Filter:**

- Shows students not in any group
- Click to view unassigned students

**Card View:**

- Each student shows all their groups as colored badges
- Badges appear below the student's name/subject

**List View:**

- Groups shown as badges to the right of student info
- Click student row to view full profile

---

## 💡 Important Notes

### About Group Creation

- **Groups are created automatically** when you:
  - Add a student and assign them to a group
  - Edit a student and add a new group
  - Create a new group in the modal using the input field
- **You DON'T need to pre-create groups** - just type the name when assigning!

### Multiple Groups

- A student **can belong to multiple groups** at the same time
- Example: "Group A" AND "Advanced" AND "Monday Class"
- Student will appear in all their group sections when filtered

### Unassigned Students

- Students with no groups appear in the "Unassigned" section
- Click "Unassigned" filter tab to view them
- You can later assign them to groups using the edit button

### Deleting Students

- Hover over a student card
- Click the trash/delete icon (🗑️)
- Confirm deletion

---

## 🎯 Common Workflows

### Workflow: Organize Students by Class

1. Click "Add Student"
2. Fill in info for student "Alice"
3. In Groups field, type "Class A" and press Enter
4. Type "Monday Group" and press Enter
5. Click "Create Student"
6. Repeat for other students in same class

**Result:** All students in "Class A" can be viewed by clicking the "Class A" filter tab

### Workflow: Move Student to Different Group

1. Find the student in the list
2. Hover to show edit button
3. Click the edit (✏️) icon
4. Uncheck current groups
5. Check new group (or type new group name and add)
6. Click "Save"

### Workflow: Add Student to Additional Group

1. Find the student
2. Click edit (✏️) icon
3. Check the new group WITHOUT unchecking existing ones
4. Click "Save"

**Result:** Student is now in multiple groups!

---

## 📊 Statistics

The Students page displays:

- **Total Students** - All students in the system
- **Groups/Classes** - Number of unique groups
- **Unassigned** - Students not in any group

---

## 🐛 Troubleshooting

### Q: I created a group but don't see it in the list?

**A:** Groups appear in the filter tabs only after they have students. Create a student and assign them to the group.

### Q: Can I delete a group?

**A:** Groups don't need to be deleted. Simply remove all students from the group and it will disappear automatically.

### Q: The student I edited doesn't show the new group?

**A:** Make sure you clicked "Save" in the modal. Wait a moment for the UI to update.

### Q: Can a student be in the same group twice?

**A:** No, the system prevents duplicate group assignments automatically.

---

## 🎨 Visual Guide

### Add Student Form - Groups Section

```
Groups / Classes (Optional - select multiple)
┌─────────────────────────────────────────┐
│ You can assign a student to multiple    │
│ groups                                   │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [Group A ×] [Advanced ×]             │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Type group name and press Enter          │
│ [__________________________________________] │
└─────────────────────────────────────────┘
```

### Students List - Group Filter Tabs

```
[All Students] [Group A (5)] [Group B (3)] [Unassigned (2)]
```

### Student Card - Groups Display

```
┌─────────────────────────┐
│ Avatar  Alice Johnson    │
│         Mathematics      │
│ [Group A]  [Advanced]    │  ← Group badges
│ [Grade 10]               │
│                          │
│ View Profile    →        │
└─────────────────────────┘
```

### Group Management Modal

```
Manage Groups
Student: Alice Johnson

Select groups (student can be in multiple groups):
☑ Group A (5 students)
☑ Advanced (3 students)
☐ Grade 10 (8 students)

Selected groups:
[Group A ×]  [Advanced ×]

Or create a new group:
[________________] [Add]

[Cancel] [Save]
```

---

## ✨ Tips & Tricks

1. **Quick Search**: Use the search box to quickly find a student, then edit their groups
2. **Bulk Management**: Edit one student's groups, then repeat for similar students
3. **Consistent Naming**: Use consistent group names (e.g., "Group A", "Group B" or "Class 2024A", "Class 2024B")
4. **Use Meaningful Names**: Names like "Monday Class", "Advanced Level", "Summer Batch" are clearer than "Group 1"
5. **Filter View**: Use group filters to quickly navigate and see all students in a specific group

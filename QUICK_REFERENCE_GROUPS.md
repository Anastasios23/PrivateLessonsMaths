# ⚡ Group Management - Quick Reference Card

## The One-Minute Summary

| Task              | Steps                                                 | Result                          |
| ----------------- | ----------------------------------------------------- | ------------------------------- |
| **Create Group**  | Add Student → Enter group name → Press ENTER → Create | Group created                   |
| **Add Group**     | Same as above, just type different name               | Student in multiple groups      |
| **Manage Groups** | Find student → Click ✏️ → Check/uncheck → Save        | Groups updated                  |
| **View by Group** | Click group filter tab below search                   | See only students in that group |
| **Unassigned**    | Click "Unassigned (X)" tab                            | See students without groups     |

---

## User Flows

### Flow 1: Add Student with Groups (Most Common)

```
[Add Student] → [Full form] → [Scroll to Groups] →
Type "Group A" + ENTER → [Create Student]
```

### Flow 2: Manage Existing Student's Groups

```
[Find student] → Hover → [✏️ Edit] → [Check groups] → [Save]
```

### Flow 3: View Students by Group

```
[See filter tabs] → [Click "Group A (5)"] → [View filtered students]
```

---

## UI Locations

| Element            | Location                        | Purpose                       |
| ------------------ | ------------------------------- | ----------------------------- |
| **Groups Section** | Add Student form, below Subject | Enter group names             |
| **Group Input**    | Below group badges              | Type group name + press ENTER |
| **Edit Button**    | Hover over student card         | Manage that student's groups  |
| **Filter Tabs**    | Below search box                | Click to filter by group      |
| **Unassigned Tab** | Group filter tabs               | View students without groups  |
| **Group Modal**    | Opens when clicking ✏️          | Checkboxes to select groups   |

---

## Keys to Success

✅ **Type group name** in the Groups input  
✅ **Press ENTER** (not Tab, Enter key!)  
✅ Watch **badge appear** above the input  
✅ **Click Create Student** to save  
✅ **Repeat** for multiple groups

---

## Common Actions

### Add student to "Group A"

```
Add Student → Groups: Group A [ENTER] → Create
```

### Add student to 2 groups

```
Add Student → Groups: Group A [ENTER] → Group B [ENTER] → Create
```

### Move student from Group A to Group B

```
Find student → Edit Groups → Uncheck Group A → Check Group B → Save
```

### Add student to multiple groups

```
Find student → Edit Groups → Check multiple → Save
```

### See all students in "Group A"

```
Click [Group A (X)] filter tab
```

### See students without groups

```
Click [Unassigned (X)] filter tab
```

---

## Input Methods

| Action       | Keys                    |
| ------------ | ----------------------- |
| Add group    | Type name + **ENTER**   |
| Remove group | Click **×** on badge    |
| Clear input  | **ENTER** (auto-clears) |
| Confirm save | Click **Save** button   |

---

## What Works

✅ Create unlimited groups  
✅ One student in multiple groups  
✅ Filter by group  
✅ Edit groups anytime  
✅ Delete students  
✅ See group counts  
✅ View by group  
✅ Search + filter

---

## Common Mistakes to Avoid

❌ **Don't:** Type group name and click away without pressing ENTER  
✅ **Do:** Press ENTER after typing group name

❌ **Don't:** Try to pre-create groups before adding students  
✅ **Do:** Type group name when adding a student

❌ **Don't:** Forget to click "Create Student" or "Save"  
✅ **Do:** Always click the final button to persist changes

❌ **Don't:** Edit a modal and close it without clicking "Save"  
✅ **Do:** Click "Save" to apply changes

---

## Example Workflow (2 minutes)

1. **Add Alice to Group A**

   - Click "Add Student"
   - Name: Alice
   - Groups: `Alice [ENTER]`
   - Create

2. **Add Bob to Group A**

   - Click "Add Student"
   - Name: Bob
   - Groups: `Group A [ENTER]`
   - Create

3. **View Group A**

   - Click `[Group A (2)]` filter
   - See both Alice and Bob

4. **Add Alice to Group B**

   - Find Alice
   - Click ✏️
   - Check "Group B"
   - Click Save

5. **Verify**
   - Click `[Group B (1)]` filter
   - See Alice

✅ Done! Alice in 2 groups, Bob in 1 group

---

## Visual Cheat Sheet

### Add Student Form - Groups Section

```
Groups / Classes
┌────────────────────────────┐
│ [Group A ×] [Group B ×]    │ ← Badges
│ [Type group name...]       │ ← Type here + ENTER
└────────────────────────────┘
```

### Filter Tabs

```
[All] [Group A (5)] [Group B (3)] [Unassigned (2)]
```

### Edit Modal

```
☑ Group A
☑ Group B
☐ Group C

[New group name] [Add]

[Cancel] [Save]
```

---

## Keyboard Shortcuts

| Action       | Shortcut                    |
| ------------ | --------------------------- |
| Add group    | Type name + **ENTER**       |
| Open edit    | Click ✏️ button             |
| Save changes | Click **Save** button       |
| Close modal  | Click **Cancel** or outside |

---

## Statistics

| Stat                | Where to See                    |
| ------------------- | ------------------------------- |
| Total Students      | Top right counter               |
| Number of Groups    | Top right counter               |
| Unassigned Students | Unassigned filter tab           |
| Students per Group  | Filter tab count: `Group A (5)` |

---

## Help!

- **Forgot how to add group?** → Type name + **ENTER**
- **Don't see filter tabs?** → Go to Students page
- **Can't find Groups section?** → Scroll down in form
- **Changes not saving?** → Click **Save** button
- **Want more details?** → Read `QUICK_START_GROUPS.md`

---

## Print This! 🖨️

Save this card as reference while learning groups feature.

---

## Remember

✅ Groups created automatically (no pre-creation)  
✅ Press ENTER to add group names  
✅ Click ✏️ to edit groups  
✅ Always click Save/Create to confirm  
✅ One student can be in many groups

**You've got this!** 🚀

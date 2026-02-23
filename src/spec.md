# Specification

## Summary
**Goal:** Implement a Test Exam Report table interface that displays student test results in a tabular format with editable data management for administrators.

**Planned changes:**
- Replace current test results display with tabular interface showing Exam Name, Exam Date, Total, %, Rank, and Global Rank columns
- Add gray header row with alternating light gray/white backgrounds for data rows
- Update backend data model to store test results with exam name, date, scored/maximum marks, percentage, rank, global rank, and attachment indicator
- Create admin interface for adding, editing, and deleting test result entries
- Implement backend CRUD operations with role-based access control (admins can modify, students can only view their own results)
- Sort test results by exam date in descending order (most recent first)
- Format Total column as 'scored/maximum' (e.g., '41/360') and calculate percentage automatically with two decimal places
- Display 'NA' in Global Rank column when no global ranking exists
- Add orange attachment icons (📎) next to exam dates where applicable

**User-visible outcome:** Students can view their test exam results in a clean, organized table format matching the uploaded screenshots, with exam names, dates, scores, percentages, ranks, and global ranks clearly displayed. Administrators can add, edit, and delete test results through an admin interface, with changes immediately reflected in student views.

# Change Log

All notable changes to **Acadsistant** will be documented in this file.

## [1.0.0] - 2026-06-19

### Added
- Initial deployment of **Acadsistant** - a complete personal academic organizer featuring calendars, daily alarms, course metrics, backlogs, to-do boards, and interactive progress widgets.

---

## [1.0.1] - 2026-06-19

### Added
- **Profile Field Upgrades**:
  - Integrated "Course" and "Year Level" fields in the student onboarding flow and settings menus to replace generic fields.
  - Modified standard state records to support Philippine curriculum tracking ("1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", and "Irregular").

### Changed
- Updated local storage hooks and initial types (`UserProfile`) in `types.ts` to seamlessly deserialize and backup `course` and `yearLevel` structures in place of legacy variables.

---

## [1.0.2] - 2026-06-19

### Added
- **Dynamic Notification Center**:
  - Added a functional notification bell at the top right header pane with a dynamic red notification badge indicator.
  - Generates automatic real-time alerts based on active academic tasks:
    - **Urgent Alerts**: Triggers warnings for uncompleted high-priority work items.
    - **Warning Alerts**: Notifies about actionable backlogs currently marked as "to-do" or "in-progress" status.
    - **Information Alerts**: Prompts about scheduling/classes scheduled for today or tomorrow, as well as active reminders.
    - **Success Alerts**: Highlights enabled daily study alarms.
  - Linked navigation shortcuts from the notification cards directly to their target views (`Calendar`, `To-Do List`, `Backlogs`, `Reminders`, `Alarms`) with automatic sidebar navigation and dismissal.
  - Added individual dismiss buttons (`X`) and a "Dismiss All" button with persistent state tracking in local storage.
- **Categorized Search Integration**:
  - Implemented full-text search query mapping across four distinct dynamic models: `Calendar Events`, `To-Do List Tasks`, `Backlogs`, and `Reminders`.
  - Added a responsive animated desktop search dropdown container that lists corresponding categorizations with custom status pills (like priority, doing/pending tags, and custom formatted dates).
  - Integrated full mobile search support cleanly embedded inside the responsive mobile menu panel.

### Changed
- Refactored global search placeholder input to remove the unneeded "notes" skeleton text.
- Standardized notification header label to say "Notifications" rather than "University Notifications" for clean integration.

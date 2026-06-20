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

---

## [1.0.3] - 2026-06-19

### Fixed
- **Dashboard View All Tasks Button**:
  - Wired up the "View All Tasks" action button inside the priority tasks widget.
  - Linked it to dynamically change the active dashboard tab so users are seamlessly navigated to the **To-Do List** tab on click.

---

## [1.0.4] - 2026-06-19

### Added
- **Expanded Academic Year Levels**:
  - Added "6th Year" option to the student onboarding and default settings forms, supporting students pursuing extended curriculum degrees.

---

## [1.2.0] - 2026-06-19

### Added
- **Interactive Weekly Class Timetable**:
  - Replaced the static "Today's Schedule" widget on the dashboard with a comprehensive weekly timetabling schedule.
  - Provided interactive day tabs ('All' for a multi-day grid overview and individual day-of-week slots).
  - Built a real-time schedule customizing modal supporting subject names, daily schedules, custom hours, and class venues (with local storage persistence).
- **Multi-Step Onboarding Flow**:
  - Created a step-by-step onboarding experience that registers student profiles first, followed by a flexible class schedule designer.
  - Implemented a "Do It Later" option to let users safely postpone timetable customization while maintaining ease of setup on the dashboard.

---

## [1.2.1] - 2026-06-20

### Added
- **Official Branding Integration**:
  - Implemented the official Acadsistant branding across all headers, sidebar views (colored vector logo), and browser tab favicon (clean transparent canvas icon).
- **Persistent Feedback Pop-Up**:
  - Integrated an uncloseable feedback widget at the bottom-right corner of the application to streamline reporting bugs, comments, and comments via a linked Google Form. Used individual pronouns to reflect the solo-built nature of the platform.
- **Developer Hyperlink**:
  - Embedded a custom styled footer hyperlink in the Settings menu ("Made with ❤️ by Marco Sebastian Senarillos/zen.exe") linking directly to the developer's GitHub repository.

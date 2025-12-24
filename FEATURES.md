# Node Mind - App Features

Node Mind is a productivity application that combines task management, knowledge organization (mind mapping), and focus tools into a single cohesive experience.

## Core Features

### 1. Task Management (Today)
Manage your daily tasks efficiently with a dedicated "Today" view.
*   **Daily Task List:** View all tasks scheduled for the current day.
*   **Task Creation:** Quickly add new tasks with titles and descriptions.
*   **Prioritization:** Assign priorities (Low, Medium, High) to tasks.
*   **Completion Tracking:** Mark tasks as complete or incomplete.
*   **Progress Tracking:** Visual header showing the number of completed tasks vs. total tasks for the day.
*   **Sorting:** Tasks are automatically sorted by completion status, priority, and creation time.
*   **Task Deletion:** Remove unwanted tasks.

### 2. Knowledge Management (Nodes & Mind Map)
Organize your thoughts and ideas using a network of connected nodes.
*   **Node Creation:** Create "Nodes" to represent ideas, notes, or concepts.
*   **Rich Content:** Nodes support titles, content (with Markdown support), and emojis.
*   **Tagging:** Organize nodes with custom tags for easy filtering.
*   **Search:** Search nodes by title, content, or tags.
*   **Mind Map Visualization:** View your nodes in an interactive 2D canvas.
    *   **Circular Layout:** Default circular arrangement for nodes.
    *   **Pan & Zoom:** Navigate the mind map canvas.
    *   **Connections:** Visually connect nodes to show relationships.
    *   **Connection Mode:** Interactive mode to draw connections between nodes.
    *   **Node Selection:** Tap nodes to view or edit details.

### 3. Focus Timer
Boost productivity using a Pomodoro-style focus timer.
*   **Session Types:** Choose between Focus (25m), Short Break (5m), and Long Break (15m) sessions.
*   **Custom Duration:** Adjust the timer duration to your preference.
*   **Timer Controls:** Start, Pause, Resume, and Stop the timer.
*   **Task Linking:** Link a specific task to your focus session to track time spent on it.
*   **Session Notes:** Add notes upon completing a session.
*   **Daily Stats:** View today's focus statistics (sessions completed, total minutes, streak).
*   **Recent Sessions:** History of recently completed focus sessions.

### 4. Analytics & Dashboard
Track your productivity trends and achievements.
*   **Weekly Statistics:** Visual breakdown of your performance over the last 7 days.
*   **Total Stats:** Aggregate view of:
    *   Total Tasks & Completed Tasks
    *   Total Notes Created
    *   Total Focus Hours
    *   Current & Longest Streaks
*   **Recent Activity:** Log of recent actions (Tasks completed, Focus sessions, Notes created).
*   **Achievements:** Gamified system with unlockable achievements based on your activity.

### 5. Settings & Customization
Personalize the app experience.
*   **Theme:** Switch between Light, Dark, or System theme.
*   **Notifications:** Toggle app notifications.
*   **Focus Settings:** Configure default focus duration, sounds, and auto-start breaks.
*   **Data Management:** Options for weekly reports and backups.

## Technical Data Models

*   **Node:** `id`, `title`, `content`, `emoji`, `tags`, `connectedNodeIds`, `positionX`, `positionY`, `createdAt`, `updatedAt`, `isMarkdown`.
*   **Task:** `id`, `title`, `description`, `isCompleted`, `priority`, `category`, `reminderDateTime`, `repeatType`, `createdAt`, `completedAt`, `tags`.
*   **FocusSession:** `id`, `durationMinutes`, `startTime`, `endTime`, `isCompleted`, `sessionType`, `taskId`, `notes`.
*   **DailyStats:** `date`, `tasksCompleted`, `focusSessionsCompleted`, `totalFocusMinutes`, `streak`.

# Node Mind

Node Mind is a comprehensive productivity application that seamlessly blends task management, visual brainstorming (mind mapping), and focus tools into a single mobile-first experience. Built with modern web technologies and wrapped for native mobile performance.

## 🚀 Features

### 1. Task Management
- **Daily Dashboard:** View your daily progress at a glance.
- **Task Creation:** Add tasks with titles, descriptions, priorities, and dates.
- **Organization:** Filter tasks by date and status.
- **Progress Tracking:** Visual progress bars and completion stats.

### 2. Mind Mapping
- **Visual Canvas:** Create infinite mind maps using a powerful node-based interface.
- **Interactive Nodes:** Drag and drop nodes, edit titles and content.
- **Connections:** Create relationships between ideas with intuitive edge connections.
- **Map Management:** Organize multiple mind maps for different projects or subjects.

### 3. Focus Timer
- **Focus Sessions:** Built-in timer to help you stay productive.
- **Session Tracking:** Track your focus history and duration.
- **Customizable:** Adjust focus durations in settings.

### 4. Mobile First Design
- **Native Feel:** Built with Ionic Framework for platform-specific UI/UX.
- **Dark Mode:** Sleek, battery-saving dark theme by default.
- **Touch Optimized:** Large touch targets and gesture support.

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [Ionic Framework](https://ionicframework.com/docs/react)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Diagramming:** [React Flow](https://reactflow.dev/)
- **Mobile Runtime:** [Capacitor](https://capacitorjs.com/)
- **Icons:** [Ionicons](https://ionic.io/ionicons)

## 📱 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-mind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

### Mobile Deployment (Android)

1. **Build the web assets**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**
   ```bash
   npx cap sync
   ```

3. **Run on Android Device**
   You can either open Android Studio:
   ```bash
   npx cap open android
   ```
   Or build and install via command line (requires Gradle):
   ```bash
   cd android
   ./gradlew installDebug
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

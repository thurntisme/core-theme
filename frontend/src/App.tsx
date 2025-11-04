import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingLayout from './components/layouts/landing/LandingLayout';
import AuthLayout from './components/layouts/portal/AuthLayout';
import PortalLayout from './components/layouts/portal/PortalLayout';
import AboutPage from './pages/landing/about/page';
import BlogPage from './pages/landing/blog/page';
import ContactPage from './pages/landing/contact/page';
import HomePage from './pages/landing/home/page';
import ProjectPage from './pages/landing/projects/page';
// Portal pages
import ActivityPage from './pages/portal/activity/page';
import BookmarksPage from './pages/portal/bookmarks/page';
import ClientsPage from './pages/portal/clients/page';
import DashboardPage from './pages/portal/dashboard/page';
import EstimationsPage from './pages/portal/estimations/page';
import FinancePage from './pages/portal/finance/page';
import HabitsPage from './pages/portal/habits/page';
import IncomePage from './pages/portal/income/page';
import JournalPage from './pages/portal/journal/page';
import LeaderPage from './pages/portal/leader/page';
import LoginPage from './pages/portal/login/page';
import PortalIndexPage from './pages/portal/page';
import PlanPage from './pages/portal/plan/page';
import ProjectReportsPage from './pages/portal/project-reports/page';
import ProjectsPage from './pages/portal/projects/page';
import QuickLinksPage from './pages/portal/quick-links/page';
import ResumePage from './pages/portal/resume/page';
import SettingsPage from './pages/portal/settings/page';
import TasksPage from './pages/portal/tasks/page';
import TodosPage from './pages/portal/todos/page';
import WorkoutsPage from './pages/portal/workouts/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/portal/auth/login" element={<LoginPage />} />
        </Route>

        <Route element={<PortalLayout />}>
          {/* Portal routes */}
          <Route path="/portal" element={<PortalIndexPage />} />
          <Route path="/portal/activity" element={<ActivityPage />} />
          <Route path="/portal/bookmarks" element={<BookmarksPage />} />
          <Route path="/portal/clients" element={<ClientsPage />} />
          <Route path="/portal/dashboard" element={<DashboardPage />} />
          <Route path="/portal/estimations" element={<EstimationsPage />} />
          <Route path="/portal/finance" element={<FinancePage />} />
          <Route path="/portal/habits" element={<HabitsPage />} />
          <Route path="/portal/income" element={<IncomePage />} />
          <Route path="/portal/journal" element={<JournalPage />} />
          <Route path="/portal/leader" element={<LeaderPage />} />
          <Route path="/portal/plan" element={<PlanPage />} />
          <Route
            path="/portal/project-reports"
            element={<ProjectReportsPage />}
          />
          <Route
            path="/portal/project-reports/:id"
            element={<ProjectReportsPage />}
          />
          <Route path="/portal/projects" element={<ProjectsPage />} />
          <Route path="/portal/projects/:id" element={<ProjectsPage />} />
          <Route path="/portal/quick-links" element={<QuickLinksPage />} />
          <Route path="/portal/resume" element={<ResumePage />} />
          <Route path="/portal/settings" element={<SettingsPage />} />
          <Route path="/portal/tasks" element={<TasksPage />} />
          <Route path="/portal/todos" element={<TodosPage />} />
          <Route path="/portal/workouts" element={<WorkoutsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import JobWebsite from "../pages/JobWebsite";
import { PublicJobsPage, PublicStoriesPage, PublicTalentPage } from "../pages/PublicSectionPages";
import Login from "../pages/Login";
import EmployerPage from "../pages/EmployerPage";
import JobSearch from "../pages/JobSearch";
import ApplicantSearch from "../pages/ApplicantSearch";
import Dashboard from "../pages/Dashboard";
import Clients from "../pages/Clients";
import Projects from "../pages/Projects";
import Tasks from "../pages/Tasks";
import Team from "../pages/Team";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobWebsite />} />
        <Route path="/jobs" element={<PublicJobsPage />} />
        <Route path="/talent" element={<PublicTalentPage />} />
        <Route path="/stories" element={<PublicStoriesPage />} />
        <Route
          path="/employers/:clientId"
          element={
            <ProtectedRoute role="employer">
              <EmployerPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route
          path="/user/jobs"
          element={
            <ProtectedRoute role="job-seeker">
              <UserLayout>
                <JobSearch />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/applicants"
          element={
            <ProtectedRoute role="employer">
              <UserLayout>
                <ApplicantSearch />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Clients />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Tasks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Team />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

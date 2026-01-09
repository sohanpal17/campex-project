import { lazy } from 'react';
import { ROUTES } from '@/constants';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PublicRoute from '@/components/layout/PublicRoute';

// Lazy load pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const ProfileSetupPage = lazy(() => import('@/pages/auth/ProfileSetupPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

const HomePage = lazy(() => import('@/pages/main/HomePage'));
const SearchPage = lazy(() => import('@/pages/main/SearchPage'));
const RequestsPage = lazy(() => import('@/pages/main/RequestsPage'));
const ItemDetailsPage = lazy(() => import('@/pages/main/ItemDetailsPage'));
const SellPage = lazy(() => import('@/pages/main/SellPage'));
const EditListingPage = lazy(() => import('@/pages/main/EditListingPage'));
const EditProfilePage = lazy(() => import('@/pages/main/EditProfilePage'));
const ChatsPage = lazy(() => import('@/pages/main/ChatsPage'));
const ChatDetailPage = lazy(() => import('@/pages/main/ChatDetailPage'));
const ProfilePage = lazy(() => import('@/pages/main/ProfilePage'));
const UserListingsPage = lazy(() => import('@/pages/main/UserListingsPage'));
const NotificationsPage = lazy(() => import('@/pages/main/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/main/SettingsPage'));
const ReportPage = lazy(() => import('@/pages/main/ReportPage'));
const BlockedUsersPage = lazy(() => import('@/pages/main/BlockedUsersPage'));

const NotFoundPage = lazy(() => import('@/pages/error/NotFoundPage'));

export const routes = [
  // Public Routes
  {
    path: ROUTES.LANDING,
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },

  // Auth Routes with Auth Layout
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.SIGNUP,
        element: (
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.VERIFY_EMAIL,
        element: <VerifyEmailPage />,
      },
      {
        path: ROUTES.PROFILE_SETUP,
        element: <ProfileSetupPage />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: (
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        ),
      },
    ],
  },

  // Protected Routes with Main Layout
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.SEARCH,
        element: <SearchPage />,
      },
      {
        path: ROUTES.REQUESTS,
        element: <RequestsPage />,
      },
      {
        path: ROUTES.ITEM_DETAILS,
        element: <ItemDetailsPage />,
      },
      {
        path: ROUTES.SELL,
        element: <SellPage />,
      },
      {
        path: ROUTES.EDIT_LISTING,
        element: <EditListingPage />,
      },
      {
        path: ROUTES.EDIT_PROFILE,
        element: <EditProfilePage />,
      },
      {
        path: ROUTES.CHATS,
        element: <ChatsPage />,
      },
      {
        path: ROUTES.CHAT_DETAIL,
        element: <ChatDetailPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.USER_LISTINGS,
        element: <UserListingsPage />,
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: <NotificationsPage />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage />,
      },
      {
        path: ROUTES.REPORT,
        element: <ReportPage />,
      },
      {
        path: ROUTES.BLOCKED_USERS,
        element: <BlockedUsersPage />,
      },
    ],
  },

  // 404 Not Found
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
];
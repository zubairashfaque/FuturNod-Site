import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import ErrorBoundary from "./components/admin/ErrorBoundary";
import Home from "./components/home";
import BlogPage from "./components/BlogPage";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UseCasesSection from "./components/UseCasesSection";
import UseCaseDetail from "./components/UseCaseDetail";
import BlogPostDetail from "./components/BlogPostDetail";
import CreateBlog from "./components/CreateBlog";
import BlogList from "./components/BlogList";

// Lazy load admin components for better performance
const BlogAdmin = lazy(() => import("./components/admin/BlogAdmin"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const BlogEditor = lazy(() => import("./components/admin/BlogEditor"));
const SupabaseSetup = lazy(() => import("./components/admin/SupabaseSetup"));
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const UseCaseAdmin = lazy(() => import("./components/admin/UseCaseAdmin"));
const UseCaseForm = lazy(() => import("./components/admin/UseCaseForm"));

function App() {
  const [tempoRoutes, setTempoRoutes] = useState<any[] | null>(null);
  const [routesLoaded, setRoutesLoaded] = useState(false);

  // Load tempo routes only when in Tempo environment
  useEffect(() => {
    if (import.meta.env.VITE_TEMPO === "true") {
      // Dynamic import to prevent initialization errors
      import("tempo-routes")
        .then((module) => {
          if (module && module.default && Array.isArray(module.default)) {
            setTempoRoutes(module.default);
          } else {
            console.warn("Tempo routes not found or not an array");
          }
        })
        .catch((error) => {
          console.error("Failed to load tempo routes:", error);
        })
        .finally(() => {
          setRoutesLoaded(true);
        });
    } else {
      setRoutesLoaded(true);
    }
  }, []);

  // Only use routes if they're properly loaded and are an array
  const tempoRoutesElement =
    routesLoaded && tempoRoutes && Array.isArray(tempoRoutes)
      ? useRoutes(tempoRoutes)
      : null;

  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/list" element={<BlogList />} />
            <Route path="/blog/create" element={<CreateBlog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/usecases" element={<UseCasesSection />} />
            <Route path="/use-cases/:id" element={<UseCaseDetail />} />
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin routes */}
            <Route
              path="/admin/AdminDashboard"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminDashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <BlogAdmin />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog/new"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Suspense fallback={<p>Loading editor...</p>}>
                      <BlogEditor />
                    </Suspense>
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog/edit/:id"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <BlogEditor />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usecases"
              element={
                <ProtectedRoute>
                  <UseCaseAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usecases/new"
              element={
                <ProtectedRoute>
                  <UseCaseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usecases/edit/:id"
              element={
                <ProtectedRoute>
                  <UseCaseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/supabase"
              element={
                <ProtectedRoute>
                  <SupabaseSetup />
                </ProtectedRoute>
              }
            />
          </Routes>
          {tempoRoutesElement}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;

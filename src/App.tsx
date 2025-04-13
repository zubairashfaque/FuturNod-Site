import { Suspense, lazy } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
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
const BlogEditor = lazy(() => import("./components/admin/BlogEditor"));
const SupabaseSetup = lazy(() => import("./components/admin/SupabaseSetup"));
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const UseCaseAdmin = lazy(() => import("./components/admin/UseCaseAdmin"));
const UseCaseForm = lazy(() => import("./components/admin/UseCaseForm"));

function App() {
  // Get tempo routes when VITE_TEMPO is true
  // @ts-ignore - tempo-routes is available at runtime
  const tempoRoutes = useRoutes(
    import.meta.env.VITE_TEMPO === "true" ? routes : [],
  );

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
              path="/admin/blog"
              element={
                <ProtectedRoute>
                  <BlogAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog/new"
              element={
                <ProtectedRoute>
                  <BlogEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog/edit/:id"
              element={
                <ProtectedRoute>
                  <BlogEditor />
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
          {tempoRoutes}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;

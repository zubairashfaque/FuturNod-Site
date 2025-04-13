import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Database,
  FileText,
} from "lucide-react";
import { getUseCases, deleteUseCase } from "../../api/usecases";
import { UseCase } from "../../api/usecases";

const UseCaseAdmin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [useCaseToDelete, setUseCaseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUseCases();
  }, [activeTab]);

  const fetchUseCases = async () => {
    setIsLoading(true);
    try {
      const fetchedUseCases = await getUseCases();
      // Filter by status if tab is not 'all'
      const filteredUseCases =
        activeTab === "all"
          ? fetchedUseCases
          : fetchedUseCases.filter((useCase) => useCase.status === activeTab);

      // Filter by search term if provided
      const searchFilteredUseCases = searchTerm
        ? filteredUseCases.filter(
            (useCase) =>
              useCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              useCase.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              useCase.industry
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              useCase.category.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : filteredUseCases;

      setUseCases(searchFilteredUseCases);
    } catch (error) {
      console.error("Error fetching use cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUseCases();
  };

  const handleDeleteUseCase = async () => {
    if (!useCaseToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUseCase(useCaseToDelete);
      setUseCases(useCases.filter((useCase) => useCase.id !== useCaseToDelete));
      setUseCaseToDelete(null);
    } catch (error) {
      console.error("Error deleting use case:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditUseCase = (useCaseId: string) => {
    // Use navigate with the correct path to edit the use case
    navigate(`/admin/usecases/edit/${useCaseId}`);
  };

  const handleViewUseCase = (useCaseId: string) => {
    // Use navigate with the correct path to view the use case
    navigate(`/usecases/${useCaseId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4 p-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Use Case Management</h1>
            <p className="text-gray-500">
              Create, edit, and manage your use cases
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 mr-2">
            Logged in as <span className="font-medium">{user?.username}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/supabase")}
            className="gap-2"
          >
            <Database className="h-4 w-4" /> Database Setup
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search use cases..."
            className="pl-10 border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <Button
          onClick={() => navigate("/admin/usecases/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> New Use Case
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading use cases...</p>
        </div>
      ) : useCases.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No use cases found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "No use cases match your search criteria"
                  : activeTab !== "all"
                    ? `You don't have any ${activeTab} use cases yet`
                    : "You haven't created any use cases yet"}
              </p>
              <Button
                onClick={() => navigate("/admin/usecases/new")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Create your first use case
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Title
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Industry
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Category
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">
                  Created
                </th>
                <th className="py-3 px-4 text-right font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {useCases.map((useCase) => (
                <tr key={useCase.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {useCase.imageUrl && (
                        <div className="h-10 w-10 overflow-hidden rounded">
                          <img
                            src={useCase.imageUrl}
                            alt={useCase.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{useCase.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {useCase.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        useCase.status === "published" ? "default" : "outline"
                      }
                      className={
                        useCase.status === "published"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {useCase.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs">
                      {useCase.industry}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="text-xs">
                      {useCase.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {formatDate(useCase.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleViewUseCase(useCase.id)}
                      >
                        <Eye className="h-3 w-3" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleEditUseCase(useCase.id)}
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                      <AlertDialog
                        open={useCaseToDelete === useCase.id}
                        onOpenChange={(open) =>
                          !open && setUseCaseToDelete(null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => setUseCaseToDelete(useCase.id)}
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the use case "{useCase.title}"
                              and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteUseCase}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UseCaseAdmin;

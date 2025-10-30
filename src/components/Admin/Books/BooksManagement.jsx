import BookDialog from "@/components/Admin/Books/BookDialog";
import BooksTable, {
  BooksTableSkeleton,
} from "@/components/Admin/Books/BooksTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Pagination from "@/components/shared/Pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { Loader2, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BooksManagement({ useLayout = true }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/books");
      if (response.data.success) {
        let books = response.data?.books || [];

        books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBooks(books);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = () => {
    setSelectedBook(null);
    setDialogOpen(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleView = (book) => {
    navigate(`/books/${book.slug}`);
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete("/book", {
        data: {
          book_id: bookToDelete.book_id,
        },
      });

      toast.success(response.data?.message || "Book deleted successfully!");
      setDeleteDialogOpen(false);
      setBookToDelete(null);
      // Fetch books again to update the list
      await fetchBooks();
    } catch (error) {
      await fetchBooks();

      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete book");
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter books based on search term
  const filteredBooks = books.filter((book) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      book.title?.toLowerCase().trim().includes(searchLower) ||
      book.author?.toLowerCase().trim().includes(searchLower) ||
      book.batch?.toLowerCase().trim().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Books Management
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage all books and publications
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Book
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 w-full ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
            <Input
              placeholder="Search books by title, author and batch..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-primary-foreground  w-full text-primary"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <BooksTableSkeleton />
      ) : books.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No books yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first book!
          </p>
          <Button onClick={handleAdd} variant="outline" className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Book
          </Button>
        </div>
      ) : (
        <>
          <BooksTable
            books={currentBooks}
            startIndex={startIndex}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            deleting={deleting}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBooks.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <BookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        book={selectedBook}
        onSuccess={fetchBooks}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the book{" "}
              <span className="font-semibold text-foreground">
                "{bookToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return useLayout ? (
    <UserDashboardLayout>{content}</UserDashboardLayout>
  ) : (
    content
  );
}

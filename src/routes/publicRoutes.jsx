import { Route } from "react-router-dom";
import BookDetailsPage from "../pages/BookDetailsPage";
import BooksPage from "../pages/BooksPage";
import CheckoutPage from "../pages/CheckoutPage";
import CourseDetailsPage from "../pages/CourseDetailsPage";
import CoursesPage from "../pages/CoursesPage";
import HomePage from "../pages/HomePage";
import NotesPage from "../pages/NotesPage";
import NotesViewPage from "../pages/NotesViewPage";
export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/courses/:slug" element={<CourseDetailsPage />} />
    <Route path="/notes" element={<NotesPage />} />
    <Route path="/notes/view" element={<NotesViewPage />} />
    <Route path="/books" element={<BooksPage />} />
    <Route path="/books/:slug" element={<BookDetailsPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
  </>
);

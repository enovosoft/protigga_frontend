import { Route } from "react-router-dom";
import BookDetailsPage from "../pages/Public/BookDetailsPage";
import BooksPage from "../pages/Public/BooksPage";
import CheckoutPage from "../pages/Public/CheckoutPage";
import CourseDetailsPage from "../pages/Public/CourseDetailsPage";
import CoursesPage from "../pages/Public/CoursesPage";
import HomePage from "../pages/Public/HomePage";
import NotFoundPage from "../pages/Public/NotFoundPage";
import NotesPage from "../pages/Public/NotesPage";
import NotesViewPage from "../pages/Public/NotesViewPage";
export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/courses" element={<CoursesPage />} />
    <Route path="/courses/:slug" element={<CourseDetailsPage />} />
    <Route path="/notes" element={<NotesPage />} />
    <Route path="/notes/:slug" element={<NotesViewPage />} />
    <Route path="/books" element={<BooksPage />} />
    <Route path="/books/:slug" element={<BookDetailsPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
);

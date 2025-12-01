import api from "@/lib/api";
import { action, thunk } from "easy-peasy";

const adminStore = {
  courses: [],
  books: [],
  instructors: [],

  loading: false,
  error: null,
  initialFetch: false,

  setLoading: action((state, payload) => {
    state.loading = payload;
  }),

  setError: action((state, payload) => {
    state.error = payload;
  }),

  setInitialFetch: action((state, payload) => {
    state.initialFetch = payload;
  }),

  setCourses: action((state, payload) => {
    state.courses = payload;
  }),

  setBooks: action((state, payload) => {
    state.books = payload;
  }),

  setInstructors: action((state, payload) => {
    state.instructors = payload;
  }),

  fetchData: thunk(async (actions) => {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const [coursesResponse, booksResponse, instructorsResponse] =
        await Promise.all([
          api.get("/courses"),
          api.get("/books"),
          api.get("/instructors"),
        ]);

      if (coursesResponse.data.success) {
        let courses = coursesResponse.data?.courses || [];
        courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        actions.setCourses(courses);
      }

      if (booksResponse.data.success) {
        let books = booksResponse.data?.books || [];
        books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        actions.setBooks(books);
      }

      if (instructorsResponse.data.success) {
        let instructors = instructorsResponse.data?.instructors || [];
        instructors.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        actions.setInstructors(instructors);
      }

      actions.setInitialFetch(true);
    } catch (error) {
      actions.setError(error.response?.data?.message || "Failed to fetch data");
    } finally {
      actions.setLoading(false);
    }
  }),

  fetchCourses: thunk(async (actions) => {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const response = await api.get("/courses");
      if (response.data.success) {
        let courses = response.data?.courses || [];
        courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        actions.setCourses(courses);
      }
    } catch (error) {
      actions.setError(
        error.response?.data?.message || "Failed to fetch courses"
      );
    } finally {
      actions.setLoading(false);
    }
  }),

  fetchBooks: thunk(async (actions) => {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const response = await api.get("/books");
      if (response.data.success) {
        let books = response.data?.books || [];
        books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        actions.setBooks(books);
      }
    } catch (error) {
      actions.setError(
        error.response?.data?.message || "Failed to fetch books"
      );
    } finally {
      actions.setLoading(false);
    }
  }),

  fetchInstructors: thunk(async (actions) => {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const response = await api.get("/instructors");
      if (response.data.success) {
        let instructors = response.data?.instructors || [];
        instructors.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        actions.setInstructors(instructors);
      }
    } catch (error) {
      actions.setError(
        error.response?.data?.message || "Failed to fetch instructors"
      );
    } finally {
      actions.setLoading(false);
    }
  }),
};

export default adminStore;

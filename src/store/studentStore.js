import api from "@/lib/api";
import { action, thunk } from "easy-peasy";

const studentStore = {
  enrollments: [],
  bookOrders: [],
  payments: [],
  exams: [],
  profile: null,
  course: null,
  loading: false,
  error: null,
  isFetched: false,

  setLoading: action((state, payload) => {
    state.loading = payload;
  }),

  setError: action((state, payload) => {
    state.error = payload;
  }),
  setFetched: action((state, payload) => {
    state.isFetched = payload;
  }),

  setCourse: action((state, payload) => {
    state.course = payload;
  }),
  setFetchData: action((state, payload) => {
    state.profile = {
      user_id: payload.user?.user_id || "",
      name: payload.user?.name || "",
      phone: payload.user?.phone || "",
    };

    state.enrollments = (payload.user?.enrollments || [])
      .filter((enrollment) => enrollment.payment?.status === "SUCCESS")
      .map((enrollment) => ({
        name: enrollment.course?.course_title || "",
        thumbnail: enrollment.course?.thumbnail || "",
        id: enrollment.course?.course_id || "",
        slug: enrollment.course?.slug || "",
        batch: enrollment.course?.batch || "",
      }));

    // Payments: combine from enrollments and book_orders
    const enrollmentPayments = (payload.user?.enrollments || [])
      .map((enrollment) => ({
        ...enrollment.payment,
        payment_type: "enrollment",
      }))
      .filter(Boolean);

    const bookOrderPayments = (payload.user?.book_orders || [])
      .map((order) => ({ ...order.payment, payment_type: "book_order" }))
      .filter(Boolean);

    state.payments = [...enrollmentPayments, ...bookOrderPayments];

    // Exams: extract from enrollments
    state.exams = (payload.user?.enrollments || []).flatMap(
      (enrollment) => enrollment.course?.exams || []
    );

    // Book Orders: keep as is
    state.bookOrders = payload.user?.book_orders || [];
  }),

  fetchStudentDetails: thunk(async (actions) => {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const response = await api.get("/user/details");
      if (response.data?.success) {
        actions.setFetchData(response.data);
      } else {
        actions.setError(response.data?.message || "Failed to load user");
      }
    } catch (err) {
      actions.setError(err.data?.message || "Failed to load user");
    } finally {
      actions.setLoading(false);
      actions.setFetched(true);
    }
  }),

  changePassword: thunk(async (actions, payload) => {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const response = await api.post("/auth/change-password", payload);
      if (response.data?.success) {
        actions.setError(null);
      } else {
        actions.setError(response.data?.message || "Failed to change password");
      }
    } catch (err) {
      actions.setError(err.message || "Failed to change password");
    } finally {
      actions.setLoading(false);
    }
  }),

  fetchCourseDetails: thunk(async (actions, slug) => {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const response = await api.get(`/control/course/${slug}`);
      if (response.data?.success) {
        actions.setCourse(response.data.course);
      } else {
        actions.setError(response.data?.message || "Failed to load course");
      }
    } catch (err) {
      actions.setError(err.response?.data?.message || "Failed to load course");
    } finally {
      actions.setLoading(false);
    }
  }),
};

export default studentStore;

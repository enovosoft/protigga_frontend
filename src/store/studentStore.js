import api from "@/lib/api";
import { action, thunk } from "easy-peasy";

const studentStore = {
  data: null,
  enrollments: [],
  payments: [],
  bookOrders: [],
  exams: [],
  profile: null,
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

  setUserData: action((state, payload) => {
    state.data = payload.user || null;

    state.profile = {
      id: payload.user?.id || null,
      user_id: payload.user?.user_id || "",
      name: payload.user?.name || "",
      phone: payload.user?.phone || "",
      is_verified: payload.user?.is_verified || false,
      is_blocked: payload.user?.is_blocked || false,
      createdAt: payload.user?.createdAt || "",
      updatedAt: payload.user?.updatedAt || "",
    };

    payload.user?.book_orders?.forEach((order) => {
      state.bookOrders.push({
        type: "book_order",
        order_id: order.payment.book_order_id || "",
        Txt_id: order.payment.Txn_ID || "",
        status: order.payment.status || "",
        amount: order.payment.product_price_with_quantity || 0,
        delivery_charge: order.payment.delevery_charge || 0,
        advance_charge: order.payment.advance_charge_amount || 0,
        discount_amount: order.payment.discount_amount || 0,
        customer_receivable_amount:
          order.payment.customer_receivable_amount || 0,
        card_type: order.payment.card_type || "",
        card_issuer: order.payment.card_issuer || "",
        transition_time: order.payment.createdAt || "",
        book_name: order.book.title || "",
        book_price: order.book.price || 0,
      });
    });

    // Enrollments
    state.enrollments = payload.user?.enrollments.map((enrollment) => {});

    // Exams (extracted from enrollments)
    state.exams = (payload.user?.enrollments || []).flatMap(
      (enrollment) => enrollment.course?.exams || []
    );
  }),

  fetchUserDetails: thunk(async (actions) => {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const response = await api.get("/user/details");
      if (response.data?.success) {
        actions.setUserData(response.data);
      } else {
        actions.setError(response.data?.message || "Failed to load user");
      }
    } catch (err) {
      actions.setError(err.message || "Failed to load user");
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
};

export default studentStore;

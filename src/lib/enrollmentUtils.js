import toast from "react-hot-toast";
import api from "./api";

export const toggleEnrollmentBlock = async (
  enrollment,
  setEnrollment,
  setLoading
) => {
  if (!enrollment) return false;

  setLoading(true);
  try {
    // Toggle the block status locally first
    setEnrollment((prev) => ({
      ...prev,
      is_blocked: !prev.is_blocked,
    }));

    // Prepare payload
    const payload = {
      enrollment_id: enrollment.enrollment_id,
      user_id: enrollment.user_id,
      is_blocked: !enrollment.is_blocked, // Use the new status
      expiry_date: enrollment.expiry_date,
    };

    const response = await api.put("/enrollment", payload);

    if (response.data.success) {
      toast.success(
        response.data.message || "Enrollment status updated successfully!"
      );
      return true;
    } else {
      // Revert the local change on failure
      setEnrollment((prev) => ({
        ...prev,
        is_blocked: enrollment.is_blocked,
      }));
      toast.error(response.data.message || "Failed to update enrollment");
      return false;
    }
  } catch (error) {
    console.error("Toggle block error:", error);
    // Revert the local change on error
    setEnrollment((prev) => ({
      ...prev,
      is_blocked: enrollment.is_blocked,
    }));
    toast.error(error.response?.data?.message || "Failed to update enrollment");
    return false;
  } finally {
    setLoading(false);
  }
};

export const updateEnrollmentExpiry = async (
  enrollment,
  newExpiryDate,
  setEnrollment,
  setLoading
) => {
  if (!enrollment || !newExpiryDate) return false;

  setLoading(true);
  try {
    // Format the date to yyyy-mm-ddT00:00:00Z
    const date = new Date(newExpiryDate);
    const formattedDate = date
      .toISOString()
      .replace(/T\d{2}:\d{2}:\d{2}/, "T00:00:00");

    const payload = {
      enrollment_id: enrollment.enrollment_id,
      user_id: enrollment.user_id,
      is_blocked: enrollment.is_blocked,
      expiry_date: formattedDate,
    };

    const response = await api.put("/enrollment", payload);

    if (response.data.success) {
      // Update local state
      setEnrollment((prev) => ({
        ...prev,
        expiry_date: new Date(newExpiryDate).toISOString(),
      }));
      toast.success("Expiry date updated successfully!");
      return true;
    } else {
      toast.error(response.data.message || "Failed to update expiry date");
      return false;
    }
  } catch (error) {
    console.error("Update expiry error:", error);
    toast.error(
      error.response?.data?.message || "Failed to update expiry date"
    );
    return false;
  } finally {
    setLoading(false);
  }
};

import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle async operations with error handling
  const handleAsync = useCallback(
    async (asyncFn, options = {}) => {
      const {
        showToast = true,
        loadingMessage,
        successMessage,
        onSuccess,
        onError,
        showErrorPage = false,
      } = options;

      setIsLoading(true);
      clearError();

      if (loadingMessage) {
        toast.loading(loadingMessage);
      }

      try {
        const result = await asyncFn();

        if (successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        console.error("Error in handleAsync:", err);

        // Determine error message
        let errorMessage = "An unexpected error occurred";

        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.response?.data?.errors?.[0]?.message) {
          errorMessage = err.response.data.errors[0].message;
        } else if (err?.message) {
          errorMessage = err.message;
        }

        // Set error state for error page display
        if (showErrorPage) {
          const errorType = getErrorType(err);
          setError({
            type: errorType,
            message: errorMessage,
            originalError: err,
          });
        }

        // Show toast notification
        if (showToast) {
          toast.error(errorMessage);
        }

        // Call custom error handler
        if (onError) {
          onError(err);
        }

        throw err; // Re-throw to allow component-level handling if needed
      } finally {
        setIsLoading(false);
        toast.dismiss(); // Clear loading toast
      }
    },
    [clearError]
  );

  // Determine error type based on error object
  const getErrorType = (error) => {
    if (!error?.response) {
      return "network";
    }

    const status = error.response.status;

    if (status === 401 || status === 403) {
      return "unauthorized";
    } else if (status === 404) {
      return "notFound";
    } else if (status >= 500) {
      return "server";
    }

    return "general";
  };

  return {
    error,
    isLoading,
    clearError,
    handleAsync,
    setError,
  };
};

// Specific error handling utilities
export const handleApiError = (error, options = {}) => {
  const { showToast = true, fallbackMessage = "Operation failed" } = options;

  let message = fallbackMessage;

  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.response?.data?.errors?.[0]?.message) {
    message = error.response.data.errors[0].message;
  } else if (error?.message) {
    message = error.message;
  }

  if (showToast) {
    toast.error(message);
  }

  return message;
};

// Network error detection
export const isNetworkError = (error) => {
  return (
    !error?.response ||
    error.code === "NETWORK_ERROR" ||
    error.code === "ERR_NETWORK"
  );
};

export default useErrorHandler;

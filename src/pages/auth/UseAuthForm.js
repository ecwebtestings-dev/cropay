
import { useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../api/AxiosClient";

export default function UseAuthForm({
  intialValues,
  validate,
  onSubmit,
  fallbackError = "Something went wrong. Please try again",
}) {
  const [values, setValues] = useState(intialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    const validateErrors = validate(values);
    setErrors(validateErrors);

    if (Object.keys(validateErrors).length > 0) return;

    setLoading(true);

    try {
      await onSubmit(values);
    } catch (error) {
      if (error.handled) return;

      const message =
        error.userMessage ||
        (error.response
          ? getErrorMessage(error)
          : error.message || fallbackError);

      toast.error(message, {
        id: "auth-error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    errors,
    loading,
    handleInputChange,
    HandleSubmit,
  };
}

import { useState } from "react";

export const useFormEdit = (initialState = {}) => {
  const [formValues, setFormValues] = useState(initialState);

  const handleInputEditChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  return [formValues, setFormValues, handleInputEditChange];
};

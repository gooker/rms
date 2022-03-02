import { useState } from 'react';

const useTablePageLoading = () => {
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  return {
    loading,
    setLoading,
    submitLoading,
    setSubmitLoading,
    deleteLoading,
    setDeleteLoading,
  };
};
export default useTablePageLoading;

import { useQuery } from "react-query";

const fetchRecords = async (baseUrl, group, table) => {
  const response = await fetch(`${baseUrl}/api/${group}/${table}/records`);
  return response.json();
};

const useRecords = (baseUrl, group, table) => {
  const { isLoading, isError, error, isSuccess, data } = useQuery(
    `${group}/${table}/records`,
    () => fetchRecords(baseUrl, group, table)
  );
  return {
    isLoading,
    isError,
    error,
    isSuccess,
    data,
  };
};

export default useRecords;

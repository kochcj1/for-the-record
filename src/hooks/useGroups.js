import { useQuery } from "react-query";

const fetchGroups = async (baseUrl) => {
  const response = await fetch(`${baseUrl}/api/groups`);
  return response.json();
};

const useGroups = (baseUrl) => {
  const { isLoading, isError, error, isSuccess, data } = useQuery(
    "groups",
    () => fetchGroups(baseUrl)
  );
  return {
    isLoading,
    isError,
    error,
    isSuccess,
    groups: data,
  };
};

export default useGroups;

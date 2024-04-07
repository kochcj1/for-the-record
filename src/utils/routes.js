const getTableRoute = (group, table) => {
  return `/${group}/${table}`.replace(/\s+/g, "+");
};

export { getTableRoute };

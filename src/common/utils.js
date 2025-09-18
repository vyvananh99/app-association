export const sortStatusFn = (rowA, rowB) => {
  const statusA = rowA.original.status;
  const statusB = rowB.original.status;
  const statusOrder = ['single', 'complicated', 'relationship'];
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

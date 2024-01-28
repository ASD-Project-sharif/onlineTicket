const sliceListByPagination = async (size, number, list) => {
  const startIndex = (number - 1) * size;
  const pagedList = list.slice(startIndex, startIndex + size);
  return pagedList;
};

PaginationServices = {
  sliceListByPagination,
};

module.exports = PaginationServices;

import React from "react";
import { connect } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import { setCurrentPage } from "../actions/list";

const PAGE_SIZE = 50;

export const Pager = ({ pager, setCurrentPage }) => {
  const { page, pageCount, total } = pager;

  const onLastPage = () => {
    if (page < pageCount) {
      setCurrentPage(pageCount);
    }
  };

  const onFirstPage = () => {
    if (page !== 0) {
      setCurrentPage(0);
    }
  };

  const handleChangePage = (event, page) => {
    setCurrentPage(page + 1);
  };

  const rowOptions = [];
  const currentPage = page - 1;

  return (
    <TablePagination
      count={total}
      rowsPerPage={PAGE_SIZE}
      page={currentPage}
      backIconButtonProps={{
        "aria-label": "Previous Page",
      }}
      nextIconButtonProps={{
        "aria-label": "Next Page",
      }}
      onChangePage={handleChangePage}
      rowsPerPageOptions={rowOptions}
    />
  );
};

export default connect(
  null,
  { setCurrentPage }
)(Pager);

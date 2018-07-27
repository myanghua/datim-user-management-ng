import React from "react";
import { connect } from "react-redux";
import { setCurrentPage } from "../actions/list";

//This is just a placeholder for now. Will be replaced with a real
//pagination object when upgrading to material-ui 1.0

const style = {
  container: {
    float: "right",
    margin: "10px"
  },
  button: {
    padding: "5px"
  },
  disabled: {
    color: "light-grey"
  },
  enabled: {
    color: "black"
  },
  status: {
    display: "inline-block"
  }
};

const backArrow = "<";
const forwardArrow = ">";
const endArrow = ">>";
const startArrow = "<<";

const PAGE_SIZE = 50;

const getStartPos = page => {
  return (page - 1) * PAGE_SIZE + 1;
};

export const Pager = ({ pager, setCurrentPage, nextPage, prevPage }) => {
  const { page, pageCount, total } = pager;

  if (!total) {
    return <div />;
  }
  const startPos = getStartPos(page);
  let endPos = startPos + PAGE_SIZE - 1;
  if (endPos > total) {
    endPos = total;
  }
  const status = `${startPos} - ${endPos} of ${total}`;
  const backArrowStyle = startPos === 1 ? style.disabled : style.enabled;
  const forwardArrowStyle = endPos === total ? style.disabled : style.enabled;

  const backStyle = Object.assign({}, style.button, backArrowStyle);
  const nextStyle = Object.assign({}, style.button, forwardArrowStyle);

  const onNextPage = () => {
    if (nextPage) {
      setCurrentPage(nextPage);
    }
  };

  const onPreviousPage = () => {
    if (prevPage) {
      setCurrentPage(prevPage);
    }
  };

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

  return (
    <div className="pager" style={style.container}>
      <div style={style.status}>{status}</div>
      <button onClick={onFirstPage} style={backStyle}>
        {startArrow}
      </button>
      <button onClick={onPreviousPage} style={backStyle}>
        {backArrow}
      </button>
      <button onClick={onNextPage} style={nextStyle}>
        {forwardArrow}
      </button>
      <button onClick={onLastPage} style={nextStyle}>
        {endArrow}
      </button>
    </div>
  );
};

export default connect(
  null,
  { setCurrentPage }
)(Pager);

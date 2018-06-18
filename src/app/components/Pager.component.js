import React from "react";

//This is just a placeholder for now. Will be replaced with a real
//pagination object when upgrading to material-ui 1.0

const style = {
  pager: {
    container: {
      float: "right",
      margin: "10px",
    },
    page: {
      display: "inline-block",
      padding: "2px",
    },
  },
};

const backArrow = "<";
const forwardArrow = ">";

const PAGE_SIZE = 50;

const getStartPos = page => {
  return (page - 1) * PAGE_SIZE + 1;
};

export const Pager = ({ pager, onNext, onPrevious }) => {
  const { page, pageCount, total } = pager;

  if (!total) {
    return <div />;
  }
  const startPos = getStartPos(page);
  const endPos = startPos + PAGE_SIZE - 1;
  const status = `${startPos} - ${endPos} of ${total}`;
  const backArrowStyle = startPos === 1 ? style.disabled : style.enabled;
  const forwardArrowStyle = endPos === total ? style.disabled : style.enabled;

  return (
    <div className="pager" style={style.pager.container}>
      <div style={style.pager.page}>{status}</div>
      <button
        onClick={onPrevious}
        style={Object.assign({}, style.pager.page, backArrowStyle)}
      >
        {backArrow}
      </button>
      <button
        onClick={onNext}
        style={Object.assign({}, style.pager.page, forwardArrowStyle)}
      >
        {forwardArrow}
      </button>
    </div>
  );
};

export default Pager;

import React, { Component } from "react";
import { connect } from "react-redux";
import throttle from "lodash.throttle";
import filterCategories from "./filterCategories";
import { setFilter } from "../../actions/list";

import "./Filter.component.css";

const filterString = (category, value) => {
  return `${category}:ilike:${value}`;
};

const FilterItemDetail = ({ id, onChange }) => {
  const category = filterCategories[id] || {};

  if (!category.model) {
    return <input type="text" onChange={onChange} />;
  } else {
    return (
      <select name="filter-group">
        <option value="first" selected>
          First
        </option>
        <option value="second">Second</option>
        <option value="third">Third</option>
      </select>
    );
  }
};

class Filter extends Component {
  state = {
    filterCategory: "",
  };
  componentDidMount() {
    this.setState({ filterCategory: this.props.filter.category });
  }

  onChangeCategory = e => {
    this.setState({ filterCategory: e.target.value });
  };

  onFilterChanged = e => {
    if (e && e.target && e.target.value) {
      const filterId = `${this.state.filterCategory}${this.props.id}`;
      const objToAdd = {
        [filterId]: {
          category: this.state.filterCategory,
          str: filterString(this.state.filterCategory, e.target.value),
        },
      };

      this.props.addFilter(objToAdd);
      this.props.onChange();
    }
  };

  render() {
    const onChangeFilter = throttle(this.onFilterChanged, 200);

    const options = Object.keys(filterCategories).map(categoryId => {
      const selected = this.state.filterCategory === categoryId ? true : null;

      return (
        <option key={categoryId} value={categoryId} selected={selected}>
          {filterCategories[categoryId].displayName}
        </option>
      );
    });

    return (
      <div className="filter-item">
        <select className="filter-category" name="filter-category" onChange={this.onChangeCategory}>
          {options}
        </select>
        <FilterItemDetail
          onChange={onChangeFilter}
          className="filter-item-detail"
          id={this.state.filterCategory}
        />
      </div>
    );
  }
}

export default connect(
  null,
  { addFilter: setFilter }
)(Filter);

import React, { Component } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import filterCategories from "./filterCategories";
import { setFilter } from "../../actions/list";

import "./Filter.component.css";

const filterString = (category, value) => {
  return value ? `${category}:ilike:${value}` : null;
};

const FilterDetail = ({ id, onChange }) => {
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
    filterDetail: "",
  };
  componentDidMount() {
    this.setState({ filterCategory: this.props.filter.category });
    this.onFilterChanged = debounce(this.onFilterChanged, 500);
  }

  onChangeCategory = e => {
    this.setState({ filterCategory: e.target.value });
  };

  onChangeFilterDetail = e => {
    this.setState({ filterDetail: e.target.value });
    this.onFilterChanged(e.target.value.trim());
  };

  onFilterChanged = text => {
    const filterId = `${this.state.filterCategory}${this.props.id}`;
    const objToAdd = {
      [filterId]: {
        category: this.state.filterCategory,
        str: filterString(this.state.filterCategory, text),
      },
    };

    this.props.addFilter(objToAdd);
    this.props.onChange();
  };

  render() {
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
        <FilterDetail
          onChange={this.onChangeFilterDetail}
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

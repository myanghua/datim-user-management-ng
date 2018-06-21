import React, { Component } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import filterCategories from "./filterCategories";
import { setFilter, removeFilter } from "../../actions/list";

import "./Filter.component.css";

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
    id: "",
    category: "",
    detail: "",
  };

  componentDidMount() {
    const { id, category, detail } = this.props.filter;

    this.setState({ id, category, detail });
    this.onFilterChanged = debounce(this.onFilterChanged, 500);
  }

  onChangeCategory = e => {
    this.setState({ category: e.target.value });
  };

  onChangeFilterDetail = e => {
    this.setState({ detail: e.target.value });
    this.onFilterChanged(e.target.value.trim());
  };

  onFilterChanged = () => {
    const filter = {
      [this.state.id]: {
        id: this.state.id,
        category: this.state.category,
        detail: this.state.detail,
      },
    };

    this.props.setFilter(filter);
  };

  onRemoveFilter = () => {
    this.props.onRemove(this.state.id);
    this.props.removeFilter(this.state.id);
  };

  render() {
    const options = Object.keys(filterCategories).map(categoryId => {
      const selected = this.state.category === categoryId ? true : null;

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
          id={this.state.category}
        />
        {this.props.onRemove ? <button onClick={this.onRemoveFilter}>Remove filter</button> : null}
      </div>
    );
  }
}

export default connect(
  null,
  {
    setFilter,
    removeFilter,
  }
)(Filter);

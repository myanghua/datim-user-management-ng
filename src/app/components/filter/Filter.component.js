import React, { Component } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import SelectField from "material-ui/lib/select-field";
import MenuItem from "material-ui/lib/menus/menu-item";
import RaisedButton from "material-ui/lib/raised-button";
import filterCategories from "./filterCategories";
import FilterDetail from "./FilterDetail.component";
import { setFilter, removeFilter } from "../../actions/list";

import "./Filter.component.css";

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

  onChangeCategory = ({}, {}, category) => {
    this.setState({ category });
  };

  onChangeFilterDetail = value => {
    this.setState({ detail: value });
    this.onFilterChanged(value.trim());
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
      return (
        <MenuItem
          key={categoryId}
          value={categoryId}
          primaryText={filterCategories[categoryId].displayName}
          checked={this.state.category === categoryId}
        />
      );
    });

    return (
      <div className="filter-item">
        <SelectField
          placeholderText="Select a filter type"
          hintText="Select a filter category"
          value={this.state.category}
          onChange={this.onChangeCategory}
        >
          {options}
        </SelectField>
        <FilterDetail
          onChange={this.onChangeFilterDetail}
          className="filter-item-detail"
          id={this.state.category}
        />
        {this.props.onRemove ? (
          <RaisedButton onClick={this.onRemoveFilter} label="Remove Filter" />
        ) : null}
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

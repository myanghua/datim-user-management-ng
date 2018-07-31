import React, { Component } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
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

  onChangeCategory = event => {
    this.setState({ category: event.target.value });
  };

  onChangeFilterDetail = value => {
    const detail = value.trim();
    this.setState({ detail });
    this.onFilterChanged(detail);
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
    this.props.removeFilter(this.state.id, !!this.state.detail);
  };

  render() {
    const options = Object.keys(filterCategories).map(categoryId => {
      return (
        <MenuItem
          key={categoryId}
          value={categoryId}
          checked={this.state.category === categoryId}
        >
          {filterCategories[categoryId].displayName}
        </MenuItem>
      );
    });

    return (
      <div className="filter-item">
        <Select
          className="filter-category"
          placeholder="Select a filter category"
          value={this.state.category}
          onChange={this.onChangeCategory}
          style={{ marginRight: 40 }}
        >
          {options}
        </Select>
        <FilterDetail
          className="filter-detail"
          onChange={this.onChangeFilterDetail}
          id={this.state.category}
        />
        {this.props.onRemove ? (
          <IconButton
            color="secondary"
            onClick={this.onRemoveFilter}
            aria-label="Remove filter"
          >
            <CancelIcon />
          </IconButton>
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

import React, { Component } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import SelectField from "material-ui/lib/select-field";
import MenuItem from "material-ui/lib/menus/menu-item";
import TextField from "material-ui/lib/text-field";
import filterCategories from "./filterCategories";
import { setFilter, removeFilter } from "../../actions/list";

import "./Filter.component.css";

class FilterDetail extends Component {
  state = {
    value: "",
  };

  valueChanged = value => {
    this.setState({ value });
    this.props.onChange(value);
  };

  onChangeTextInput = e => {
    this.valueChanged(e.target.value);
  };

  onChangeSelectInput = ({}, {}, value) => {
    this.valueChanged(value);
  };

  render() {
    const { id, core } = this.props;
    const category = filterCategories[id] || {};

    if (!category.model) {
      return (
        <TextField
          id="category-value"
          label="value"
          placeholderText="Search text"
          value={this.state.value}
          onChange={this.onChangeTextInput}
          margin="normal"
        />
      );
    }

    let options = [];
    if (category.model === "userTypes") {
      options = core.userTypes;
    }

    const optionComponents = options.map((o, i) => {
      return <MenuItem key={i} value={o} primaryText={o} checked={o === this.state.value} />;
    });

    return (
      <SelectField
        hintText="Select a value"
        value={this.state.value}
        onChange={this.onChangeSelectInput}
        placeholderText="Select a value"
      >
        {optionComponents}
      </SelectField>
    );
  }
}

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
          core={this.props.core}
        />
        {this.props.onRemove ? <button onClick={this.onRemoveFilter}>Remove filter</button> : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { core } = state;
  return {
    core,
  };
};

export default connect(
  mapStateToProps,
  {
    setFilter,
    removeFilter,
  }
)(Filter);

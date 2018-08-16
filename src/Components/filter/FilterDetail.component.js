import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import filterCategories from "./filterCategories";
import {
  getUserGroups,
  getUserTypes,
  getCountries,
  getUserRoles,
} from "../../reducers/coreReducers";

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

  //eslint-disable-next-line no-empty-pattern
  onChangeSelectInput = event => {
    this.valueChanged(event.target.value);
  };

  render() {
    const { id } = this.props;
    const category = filterCategories[id] || {};

    if (!category.model) {
      return (
        <Input
          placeholder="Value"
          value={this.state.value}
          onChange={this.onChangeTextInput}
          margin="none"
          style={{ minWidth: "300px" }}
        />
      );
    }

    let optionComponents = [];
    if (category.model === "userTypes") {
      optionComponents = this.props.userTypes.map((o, i) => (
        <MenuItem key={i} value={o} checked={o === this.state.value}>
          {o}
        </MenuItem>
      ));
    } else if (category.model === "orgunit") {
      optionComponents = this.props.countries.map(country => {
        return (
          <MenuItem
            key={country.id}
            value={country.name}
            checked={country.name === this.state.value}
          >
            {country.name}
          </MenuItem>
        );
      });
    } else if (category.model === "usergroup") {
      optionComponents = this.props.userGroups.map(g => {
        return (
          <MenuItem key={g.id} value={g.name} checked={g.name === this.state.value}>
            {g.name}
          </MenuItem>
        );
      });
    } else if (category.model === "userrole") {
      optionComponents = this.props.userRoles.map(g => {
        return (
          <MenuItem key={g.id} value={g.name} checked={g.name === this.state.value}>
            {g.name}
          </MenuItem>
        );
      });
    }

    return (
      <Select
        value={this.state.value}
        onChange={this.onChangeSelectInput}
        placeholder="Select a value"
        style={{ minWidth: "300px" }}
      >
        {optionComponents}
      </Select>
    );
  }
}

const mapStateToProps = state => {
  return {
    userGroups: getUserGroups(state),
    userTypes: getUserTypes(state),
    countries: getCountries(state),
    userRoles: getUserRoles(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(FilterDetail);

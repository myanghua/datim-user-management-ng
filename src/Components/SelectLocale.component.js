import React, { Component } from "react";
import PropTypes from "prop-types";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

// import AppTheme from "../colortheme";

class SelectLocale extends Component {
  propTypes: {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  contextTypes: {
    d2: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.props.onChange;
  }

  render() {
    const localeMenus = this.props.locales.map(v => (
      <MenuItem key={v.locale} value={v.locale}>
        {v.name}
      </MenuItem>
    ));

    return (
      <FormControl required style={{ width: "100%", marginTop: "1em" }}>
        <InputLabel htmlFor="locale">Language</InputLabel>
        <Select
          value={this.props.value || ""}
          onChange={this.handleChange}
          inputProps={{
            name: "locale",
            id: "locale",
          }}
        >
          {localeMenus}
        </Select>
        <FormHelperText>Select a language</FormHelperText>
      </FormControl>
    );
  }
}

export default SelectLocale;

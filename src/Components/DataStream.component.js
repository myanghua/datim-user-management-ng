import React from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

class DataStream extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = event => {
    this.props.onChangeStream(this.props.stream.key, event.target.value);
  };

  render() {
    const { stream } = this.props;
    // shorten the variable
    const accessLevels = stream.value.accessLevels;

    const locked =
      (accessLevels["View Data"] &&
        accessLevels["View Data"].locked &&
        accessLevels["View Data"].locked === 1) ||
      (accessLevels["Enter Data"] &&
        accessLevels["Enter Data"].locked &&
        accessLevels["Enter Data"].locked === 1);

    return (
      <FormControl
        component="fieldset"
        required
        className="stream"
        disabled={this.props.userManager || locked === 1}
      >
        <FormLabel component="legend">{stream.key}</FormLabel>
        <RadioGroup
          aria-label={stream.key}
          name={stream.key}
          value={this.props.selected}
          onChange={this.handleChange}
        >
          <FormControlLabel value="noaccess" control={<Radio />} label="No Access" />
          {accessLevels.hasOwnProperty("View Data") ? (
            <FormControlLabel value="View Data" control={<Radio />} label="View Data" />
          ) : null}
          {accessLevels.hasOwnProperty("Enter Data") ? (
            <FormControlLabel value="Enter Data" control={<Radio />} label="Enter Data" />
          ) : null}
        </RadioGroup>
      </FormControl>
    );
  }
}

export default DataStream;

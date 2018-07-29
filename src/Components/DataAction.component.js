import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class DataAction extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { checked: false };
  }

  handleChange = name => event => {
    this.props.onChangeAction(this.props.action.roleUID, !this.props.checked);
  };

  render() {
    const { action } = this.props;

    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={this.props.checked}
            onChange={this.handleChange(action.name)}
            value={action.name}
          />
        }
        label={action.name}
        disabled={action.locked === 1 || this.props.userManager}
      />
    );
  }
}

export default DataAction;

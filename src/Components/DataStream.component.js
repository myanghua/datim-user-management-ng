import React from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

class DataStream extends React.Component {
  constructor(props) {
    super(props);
    // make sure preSelected fields are checked
    this.state = { defaultSelected: this.props.selected };
    this.handleClick = this.handleClick.bind(this);
  }

  updateState() {
    const { stream } = this.props;
    let canView = stream.value.hasOwnProperty("View Data");
    let canEdit = stream.value.hasOwnProperty("Enter Data");
    let defaultSelected = "noaccess";

    if (canEdit) {
      if (
        stream.value["Enter Data"].preSelected === 1 ||
        (stream.value["Enter Data"].selectWhenUA === 1 && this.props.userManager === true)
      ) {
        defaultSelected = "Enter Data";
      }
    } else if (canView) {
      if (
        stream.value["View Data"].preSelected === 1 ||
        (stream.value["View Data"].selectWhenUA === 1 && this.props.userManager === true)
      ) {
        defaultSelected = "View Data";
      }
    }

    return { defaultSelected: defaultSelected };
  }

  componentDidUpdate(prevProps) {
    this.setState(this.updateState());
  }

  handleClick(event) {
    this.setState({ defaultSelected: event.target.value });
    this.props.onChangeStream(this.props.stream.key, event.target.value);
  }

  render() {
    const { stream } = this.props;

    return (
      <div className="stream">
        <h4>{stream.key}</h4>
        <RadioGroup
          style={{ display: "inline", fontSize: "smaller" }}
          name={stream.key}
          valueSelected={this.state.defaultSelected}
          onChange={this.handleClick}
        >
          <Radio value="noaccess" label="No access" disabled={this.props.userManager} />
          {stream.value.hasOwnProperty("View Data") ? (
            <Radio
              value="View Data"
              label="View Data"
              disabled={this.props.userManager}
            />
          ) : (
            <span style={{ display: "none" }} />
          )}
          {stream.value.hasOwnProperty("Enter Data") ? (
            <Radio
              value="Enter Data"
              label="Enter Data"
              disabled={this.props.userManager}
            />
          ) : (
            <span style={{ display: "none" }} />
          )}
        </RadioGroup>
      </div>
    );
  }
}

export default DataStream;
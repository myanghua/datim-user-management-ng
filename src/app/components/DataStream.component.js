import React from 'react';
import {connect} from "react-redux";
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import RadioButton from 'material-ui/lib/radio-button';

class DataStream extends React.Component {

  constructor(props) {
    super(props);
    // make sure preSelected fields are checked
    this.state = {defaultSelected: this.props.selected};
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    this.state = {defaultSelected: this.props.selected};
  }

  handleClick(event) {
    this.setState({defaultSelected: event.target.value});
    this.props.onChangeStream(this.props.stream.key,event.target.value);
  }

  render() {
    const { stream } = this.props;

    return (
      <div className="stream">
        <h4>{stream.key}</h4>
        <RadioButtonGroup
              style={{display:"inline",fontSize:"smaller"}}
              name={stream.key}
              valueSelected={this.state.defaultSelected}
              onChange={this.handleClick}
        >
          <RadioButton
            value="noaccess"
            label="No access"
            disabled={this.props.userManager}
          />
        {stream.value.accessLevels['View Data'] || false ?
            <RadioButton
              value="View Data"
              label="View Data"
              disabled={this.props.userManager}
            />
            : <span style={{display:"none"}}/>}
          {stream.value.accessLevels['Enter Data'] || false ?
            <RadioButton
              value="Enter Data"
              label="Enter Data"
              disabled={this.props.userManager}
            />
          : <span style={{display:"none"}}/>}
        </RadioButtonGroup>
      </div>
    );
  }

}

export default DataStream;

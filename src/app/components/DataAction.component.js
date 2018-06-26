import React from 'react';
import {connect} from "react-redux";
import Checkbox from 'material-ui/lib/checkbox';


class DataAction extends React.Component {

  constructor(props) {
    super(props);
    // make sure preSelected fields are checked
    this.state = this.updateState();
    this.handleClick = this.handleClick.bind(this);
  }

  updateState() {
    const { action } = this.props;
    let checked = false;

    if (action.preSelected || (action.selectWhenUA===1 && this.props.userManager===true)){
      checked = true;
    }

    return {checked: checked};
  }

  componentDidUpdate(prevProps) {
    if (this.props.userManager !== prevProps.userManager || this.props.action!==prevProps.action) {
      this.setState(this.updateState());
    }
  }

  handleClick() {
    this.props.onChangeAction(this.props.action.roleUID,!this.state.checked);
    this.setState((oldState) => {
      return {
        checked: !oldState.checked,
      };
    });
  }

  render() {
    const { action } = this.props;

    return (
        <Checkbox
         label={action.name}
         checked={this.state.checked}
         onCheck={this.handleClick}
         disabled={action.locked===1}
       />
    );
  }

}

export default DataAction;

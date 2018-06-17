import React from 'react';

import FontIcon from 'material-ui/lib/font-icon';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import TableRowColumn from 'material-ui/lib/table';

import AppTheme from '../../colortheme';
import actions from '../../actions';
import '../../translationRegistration';

const styles = {
  activeColor:  "#00C853",
  disabledColor: "#E53935",
  icon: {
    color:"#369",
    marginRight: 2
  }
}


class UserCell extends React.Component {

  handleClickEdit = () => {
    this.props.onClickEdit(this.props.user);
  }

  handleClickDisable = () => {
    this.props.onClickDisable(this.props.user);
  }

  render() {
    const user = this.props.user;

    return (
      <div>
        <h4>{user.surname}, {user.firstName}</h4>

        <FloatingActionButton
          mini={true}
          style={{float:'right'}}
          backgroundColor={(user.userCredentials.disabled===true)?styles.disabledColor:styles.activeColor}
          onClick={this.handleClickDisable}
        >
          <FontIcon className="material-icons">{(user.userCredentials.disabled===true)?'cancel':'check_box'}</FontIcon>
        </FloatingActionButton>

        <FloatingActionButton
          mini={true}
          style={{float:'right'}}
          onClick={this.handleClickEdit}
        >
          <FontIcon className="material-icons">edit</FontIcon>
        </FloatingActionButton>

        <p>
          <FontIcon className="material-icons" style={styles.icon}>email</FontIcon>
          {user.email}
        </p>
        <p>
          <FontIcon className="material-icons" style={styles.icon}>person</FontIcon>
          {user.userCredentials.username}
        </p>
      </div>
    );
  }
}

export default UserCell;

import React from 'react';
import {connect} from "react-redux";
import Dialog from 'material-ui/lib/dialog';

class AccessDenied extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { access } = this.props;

    return (
      <div>
        { (access.show == true) ?
        <Dialog
            title="Access Denied"
            modal={true}
            open={true}
            className="accessDeniedDialog"
            titleClassName="accessDeniedTitle"
            overlayClassName="accessDeniedBackground"
          >
            {access.message}
        </Dialog>
        : null }
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  access: state.access,
});

export default connect(mapStateToProps)(AccessDenied)

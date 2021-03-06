import React from 'react';
import PropTypes from 'prop-types';
import { noop, Icon, Masthead as PfMasthead, MenuItem } from 'patternfly-react';
import { withRouter } from 'react-router-dom';
import { connect, reduxActions, store } from '../../redux';
import { aboutModalTypes } from '../../redux/constants';
import iconImg from '../../img/logo-alt.svg';
import titleImg from '../../img/brand-alt.svg';

class Masthead extends React.Component {
  state = {
    mobileToggle: true
  };

  onAbout = e => {
    e.preventDefault();
    store.dispatch({
      type: aboutModalTypes.ABOUT_MODAL_SHOW
    });
  };

  onHelp = e => {
    e.preventDefault();
    this.props.history.push('/help');
  };

  onLogoutUser = e => {
    const { logoutUser } = this.props;

    e.preventDefault();
    Promise.all([logoutUser()]).then(() => window.location.replace('/'));
  };

  navToggle = () => {
    const { mobileToggle } = this.state;

    this.setState({ mobileToggle: !mobileToggle });
  };

  renderMobileNav() {
    const { mobileToggle } = this.state;

    if (mobileToggle) {
      return null;
    }

    return (
      <div
        role="menu"
        className="nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-vertical-with-badges hidden show-mobile-nav"
        aria-live="polite"
      >
        <ul className="list-group">
          <li className="list-group-item">
            <a role="menuitem" href="#about" onClick={this.onAbout}>
              <span className="list-group-item-value">About</span>
            </a>
          </li>
          <li className="list-group-item">
            <a role="menuitem" href="#help" onClick={this.onHelp}>
              <span className="list-group-item-value">Help</span>
            </a>
          </li>
          <li className="list-group-item">
            <a role="menuitem" href="#logout" onClick={this.onLogoutUser}>
              <span className="list-group-item-value">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    );
  }

  renderActions() {
    return (
      <PfMasthead.Dropdown id="app-help-dropdown" noCaret title={<span aria-hidden className="pficon pficon-help" />}>
        <MenuItem eventKey="1" onClick={this.onHelp}>
          Help
        </MenuItem>
        <MenuItem eventKey="2" onClick={this.onAbout}>
          About
        </MenuItem>
      </PfMasthead.Dropdown>
    );
  }

  renderUserDropdown() {
    const { user } = this.props;
    const title = (
      <React.Fragment>
        <Icon type="pf" name="user" key="user-icon" />{' '}
        {user && (
          <span className="dropdown-title" key="dropdown-title">
            {user.username} {` `}
          </span>
        )}
      </React.Fragment>
    );

    return (
      <PfMasthead.Dropdown id="app-user-dropdown" title={title}>
        <MenuItem onClick={this.onLogoutUser}>Logout</MenuItem>
      </PfMasthead.Dropdown>
    );
  }

  render() {
    return (
      <PfMasthead
        iconImg={iconImg}
        titleImg={titleImg}
        title="PatternFly Enterprise Application"
        onNavToggleClick={this.navToggle}
      >
        <PfMasthead.Collapse>
          {this.renderActions()}
          {this.renderUserDropdown()}
        </PfMasthead.Collapse>
        {this.renderMobileNav()}
      </PfMasthead>
    );
  }
}

Masthead.propTypes = {
  logoutUser: PropTypes.func,
  user: PropTypes.shape({
    username: PropTypes.string
  }),
  history: PropTypes.object
};

Masthead.defaultProps = {
  logoutUser: noop,
  user: {},
  history: {}
};

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(reduxActions.userActions.logoutUser())
});

const mapStateToProps = state => ({
  user: state.userReducers.session
});

const ConnectedMasthead = connect(
  mapStateToProps,
  mapDispatchToProps
)(Masthead);

const RoutedConnectedMasthead = withRouter(ConnectedMasthead);

export { RoutedConnectedMasthead as default, ConnectedMasthead, Masthead };

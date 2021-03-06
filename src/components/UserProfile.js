import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUserProfile } from '../action/profile';
import { APIUrls } from '../helpers/urls';
import { getAuthTokenFromLocalStorage } from '../helpers/utils';
import { addFriend, removeFriend } from '../action/friends';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      error: null,
      successMessage: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;

    //--- here userId id the id of the user whose profile we visit
    if (match.params.userId) {
      this.props.dispatch(fetchUserProfile(match.params.userId));
    }
  }

  componentDidUpdate(prevProps) {
    //---- rename params to prevParams/currParams
    const {
      match: { params: prevParams },
    } = prevProps;

    const {
      match: { params: currentParams },
    } = this.props;

    if (
      prevProps &&
      currentParams &&
      prevParams.userId !== currentParams.userId
    ) {
      this.props.dispatch(fetchUserProfile(currentParams.userId));
    }
  }

  //---- method to check if user is already a fried or not (to show add/remove button)
  checkIfUserIsAFriend = () => {
    console.log('this.props(userProfile)', this.props);
    const { match, friends } = this.props;
    const userId = match.params.userId;

    const index = friends.map((friend) => friend.to_user._id).indexOf(userId);

    if (index !== -1) {
      return true;
    }

    return false;
  };

  //---- method to add user as friend
  handleAddFriendClick = async () => {
    const userId = this.props.match.params.userId;
    const url = APIUrls.addFriend(userId);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data) {
      this.setState({
        success: true,
        successMessage: 'Added friend successfully!',
      });

      this.props.dispatch(addFriend(data.data.friendship));
    } else {
      this.setState({
        success: null,
        error: data.message,
      });
    }
  };

  //---- method to unFriend user
  handleRemoveFriendClick = async () => {
    const { match } = this.props;
    const url = APIUrls.removeFriend(match.params.userId);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    //console.log('await data', data);

    if (data.success) {
      this.setState({
        success: true,
        successMessage: 'Removed friends successfully!',
      });
      this.props.dispatch(removeFriend(match.params.userId));
    } else {
      this.setState({
        success: null,
        error: data.message,
      });
    }
  };

  render() {
    const {
      match: { params },
      profile,
    } = this.props;

    console.log('this.props', params);
    const user = profile.user;

    if (profile.inProgress) {
      return <div className="loader"></div>;
    }

    const isUserAFriend = this.checkIfUserIsAFriend();

    const { success, error } = this.state;
    return (
      <div className="settings">
        <div className="img-container">
          <img
            src="https://image.flaticon.com/icons/svg/2154/2154651.svg"
            alt="user-dp"
          />
        </div>

        <div className="field">
          <div className="field-label">Name</div>
          <div className="field-value">{user.name}</div>
        </div>

        <div className="field">
          <div className="field-label">Email</div>
          <div className="field-value">{user.email}</div>
        </div>

        <div className="btn-grp">
          {!isUserAFriend ? (
            <button
              className="button save-btn"
              onClick={this.handleAddFriendClick}
            >
              Add Friend
            </button>
          ) : (
            <button
              className="button save-btn"
              onClick={this.handleRemoveFriendClick}
            >
              UnFriend
            </button>
          )}

          {success && (
            <div className="alert success-dailog">
              Friend added successfully
            </div>
          )}
          {error && <div className="alert error-dailog">{error}</div>}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ profile, friends }) {
  return {
    profile,
    friends,
  };
}
export default connect(mapStateToProps)(UserProfile);

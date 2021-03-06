import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Comment } from './';
import { createComment, addLikeToStore } from '../action/posts';

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      showComments: false,
    };
  }

  //---- method to dispatch an action on presing enter after typing comment
  handleAddComment = (e) => {
    const { comment } = this.state;
    const { post } = this.props;

    if (e.key === 'Enter') {
      this.props.dispatch(createComment(comment, post._id));

      // clear comment
      this.setState({
        comment: '',
      });
    }
  };

  //---- method to keep adding input from input arear and store it to state
  handleOnCommentChange = (e) => {
    this.setState({
      comment: e.target.value,
    });
  };

  //---- method to dispatch action on liking a post
  handlePostLike = () => {
    const { post, user } = this.props;

    this.props.dispatch(addLikeToStore(post._id, 'Post', user._id));
  };

  //---- method to toggle comment display
  hadleShowComment = () => {
    var comment = this.state.showComments;

    this.setState({
      showComments: !comment,
    });
  };

  //---- method to display post date
  handleSetDate = (postDate) => {
    //---- storing curr date
    var today = new Date();
    var currMonth = today.getMonth() + 1;
    var currDate = today.getDate();

    //console.log('CurrDate:', currMonth, currDate);
    //---- storing post date
    //var year = postDate.slice(0, 4);
    var month = postDate.slice(5, 7);
    var date = postDate.slice(8, 10);
    var hour = postDate.slice(11, 13);
    var minute = postDate.slice(14, 16);

    if (month.slice(0, 1) === '0') {
      month = month.slice(1, 2);
    }
    if (date.slice(0, 1) === '0') {
      date = date.slice(1, 2);
    }
    //console.log('Date:', month, date);
    //console.log('Time:', hour, minute);

    if (currDate.toString() === date && currMonth.toString() === month) {
      let finalDate = 'Today at ' + hour + ':' + minute;
      return finalDate;
    } else {
      var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      let finalDate =
        months[month - 1] + ' ' + date + ' at ' + hour + ':' + minute;
      return finalDate;
    }
  };

  render() {
    const { post, user } = this.props;
    const { comment, showComments } = this.state;

    const isPostLikedByUser = post.likes.includes(user._id);
    return (
      <div className="post-wrapper" key={post._id}>
        <div className="post-header">
          <div className="post-avatar">
            <Link
              to={
                user._id === post.user._id
                  ? '/settings'
                  : `/user/${post.user._id}`
              }
            >
              <img
                src="https://image.flaticon.com/icons/svg/2154/2154651.svg"
                alt="user-pic"
              />
            </Link>
            <div>
              <span className="post-author">{post.user.name}</span>
              <span className="post-time">
                {this.handleSetDate(post.createdAt)}
              </span>
            </div>
          </div>
          <div className="post-content">{post.content}</div>

          <div className="post-actions">
            <button className="post-like no-btn" onClick={this.handlePostLike}>
              {isPostLikedByUser ? (
                <img
                  src="https://image.flaticon.com/icons/svg/1076/1076984.svg"
                  alt="like post"
                />
              ) : (
                <img
                  src="https://image.flaticon.com/icons/svg/1077/1077035.svg"
                  alt="likes-icon"
                />
              )}
              <span> {post.likes.length}</span>
            </button>

            <div className="post-comments-icon" onClick={this.hadleShowComment}>
              <img
                src="https://image.flaticon.com/icons/svg/1380/1380338.svg"
                alt="comments-icon"
              />
              <span>{post.comments.length}</span>
            </div>
          </div>
          <div className="post-comment-box">
            <input
              placeholder="Start typing a comment..."
              onChange={this.handleOnCommentChange}
              onKeyPress={this.handleAddComment}
              value={comment}
            />
          </div>

          {showComments && (
            <div className="post-comments-list">
              {post.comments.map((comment) => (
                <Comment
                  comment={comment}
                  key={comment._id}
                  postId={post._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

function mapStateToProps({ auth }) {
  return {
    user: auth.user,
  };
}

export default connect(mapStateToProps)(Post);

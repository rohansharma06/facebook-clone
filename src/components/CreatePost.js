import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createPost } from '../action/posts';

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  //---- method to add post on click
  handleOnClick = () => {
    this.props.dispatch(createPost(this.state.content));

    //--- creae post input
    this.setState({
      content: '',
    });
  };

  //---- method to keep adding the content of post in state
  handleChange = (e) => {
    this.setState({
      content: e.target.value,
    });
  };

  //---- render start
  render() {
    const { User } = this.props;
    //console.log('NAME:', User);
    return (
      <div className="create-post">
        <textarea
          placeholder={`What's on your mind, ${User}?`}
          className="add-post"
          value={this.state.content}
          onChange={this.handleChange}
        />

        <div>
          <button id="add-post-btn" onClick={this.handleOnClick}>
            Add Post
          </button>
        </div>
      </div>
    );
  }
}

function mapStoreToProps({ auth }) {
  return {
    User: auth.user.name,
  };
}
//--- here we just need dispatch
//-- if we not make a function(mapStateToProps) it will automatically pass dispatch action
export default connect(mapStoreToProps)(CreatePost);

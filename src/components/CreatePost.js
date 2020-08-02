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
    return (
      <div className="create-post">
        <textarea
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

//--- here we just need dispatch
//-- if we not make a function(mapStateToProps) it will automatically pass dispatch action
export default connect()(CreatePost);

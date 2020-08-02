import {
  UPDATE_POSTS,
  ADD_POST,
  ADD_COMMENT,
  UPDATE_POST_LIKE,
} from './actionTypes';
import { APIUrls } from '../helpers/urls';
import { getAuthTokenFromLocalStorage, getFormBody } from '../helpers/utils';

//---- fetching post using API
export function fetchPosts() {
  return (dispatch) => {
    const url = APIUrls.fetchPosts(1, 25);
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('data:', data);
        dispatch(updatePosts(data.data.posts));
      });
  };
}

//---- after fetch the post from API we have to call reducer to add post to store
export function updatePosts(posts) {
  return {
    type: UPDATE_POSTS,
    posts,
  };
}

//---- add post to the API DB
export function createPost(content) {
  return (dispatch) => {
    const url = APIUrls.createPost();

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
      body: getFormBody({ content }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Create_post:Data', data);

        if (data.success) {
          dispatch(addPost(data.data.post));
        }
      });
  };
}

//---- add Post when user create a post
export function addPost(post) {
  return {
    type: ADD_POST,
    post,
  };
}

//---- add comment to the post API
export function createComment(content, postId) {
  return (dispatch) => {
    const url = APIUrls.createComment();

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
      body: getFormBody({ content, post_id: postId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          dispatch(addComment(data.data.comment, postId));
        }
      });
  };
}

//----- call reducer to add comment to the post
export function addComment(comment, postId) {
  return {
    type: ADD_COMMENT,
    comment,
    postId,
  };
}

//---- fectch API for toggle like on POST
export function addLikeToStore(id, likeType, userId) {
  return (dispatch) => {
    const url = APIUrls.toggleLike(id, likeType);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('LIKE DATA', data);

        if (data.success) {
          dispatch(addPostLike(id, userId));
        }
      });
  };
}
//---- Calling reducer to update post like status
export function addPostLike(postId, userId) {
  return {
    type: UPDATE_POST_LIKE,
    postId,
    userId,
  };
}

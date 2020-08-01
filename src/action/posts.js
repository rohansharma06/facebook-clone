import { UPDATE_POSTS, ADD_POST } from './actionTypes';
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

//---- add Post when user create a post
export function addPost(post) {
  return {
    type: ADD_POST,
    post,
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

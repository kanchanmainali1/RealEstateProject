import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

// Single page loader
export const singlePageLoader = async ({ request, params }) => {
  try {
    const res = await apiRequest(`/posts/${params.id}`);
    if (!res || !res.data) {
      throw new Error("Post not found");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Post not found or unable to fetch data");
  }
};

// List page loader
export const listPageLoader = async ({ request, params }) => {
  try {
    const query = request.url.split("?")[1];
    const postPromise = apiRequest(`/posts?${query}`);
    return defer({
      postResponse: postPromise,
    });
  } catch (error) {
    console.error("Error fetching list of posts:", error);
    return defer({
      postResponse: null, // Return empty or error response
    });
  }
};

// Profile page loader
export const profilePageLoader = async () => {
  try {
    const postPromise = apiRequest("/users/profilePosts");
    const chatPromise = apiRequest("/chats");
    return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return defer({
      postResponse: null, // Return empty or error response
      chatResponse: null, // Same for chat data
    });
  }
};
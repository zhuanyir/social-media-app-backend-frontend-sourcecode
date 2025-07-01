import React from "react";
import "./posts.scss";
import Post from "../post/Post";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["posts", userId || "home"],
    queryFn: () => {
      const url = userId ? `/posts?userId=${userId}` : "/posts";
      return makeRequest.get(url).then((res) => res.data);
    },
  });

  console.log("isPending:", isPending);
  console.log("error:", error);
  console.log("data:", data);

  if (isPending) return <div>is loading...</div>;
  if (error) return <div>error：{error.message}</div>;
  if (!data || data.length === 0) return <div>no data</div>;
  // console.log(
  //   "Post IDs:",
  //   data.map((p) => p.id)
  // );
  return (
    <div className="posts">
      {data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Posts;

import React, { useContext } from "react";
import "./stories.scss";
import { dividerClasses } from "@mui/material";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  // search the user data
  const {
    data: updatedUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", currentUser.id],
    queryFn: () =>
      makeRequest
        .get(`/users/find?userId=${currentUser.id}`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5分钟缓存
    enabled: !!currentUser?.id, // 确保有用户ID才请求
  });

  const user = updatedUser || currentUser;

  // temporary data
  const stories = [
    {
      id: 1,
      name: "Zhuanyi Zhu",
      img: "https://images.pexels.com/photos/31461532/pexels-photo-31461532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 2,
      name: "Zhuanyi Zhu",
      img: "https://images.pexels.com/photos/31461532/pexels-photo-31461532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 3,
      name: "Zhuanyi Zhu",
      img: "https://images.pexels.com/photos/31461532/pexels-photo-31461532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 4,
      name: "Zhuanyi Zhu",
      img: "https://images.pexels.com/photos/31461532/pexels-photo-31461532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];
  return (
    <div className="stories">
      <div className="story">
        <img
          src={
            user.profilePic?.startsWith("http")
              ? user.profilePic
              : `/upload/${user.profilePic}`
          }
          alt=""
        />
        <span>{user.name}</span>
        <button>+</button>
      </div>
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;

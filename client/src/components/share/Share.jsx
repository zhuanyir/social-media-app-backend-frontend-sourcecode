import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { makeRequest } from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

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
    staleTime: 1000 * 60 * 5,
    enabled: !!currentUser?.id,
  });

  const user = updatedUser || currentUser;

  const [file, setFile] = useState(null);
  const [descp, setDescp] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      console.log("Post created:", data);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error(
        "Failed to create post:",
        error?.response?.data || error.message
      );
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ descp, img: imgUrl });
    setDescp("");
    setFile(null);
  };
  console.log("currentUser:", currentUser);

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={
                user?.profilePic?.startsWith("http")
                  ? user.profilePic
                  : `/upload/${user.profilePic}`
              }
            />
            <input
              type="text"
              placeholder={`What's on your mind ${user?.name || "user"}?`}
              onChange={(e) => setDescp(e.target.value)}
              value={descp}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;

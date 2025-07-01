import "./comments.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [descp, setDescp] = useState("");

  const { isPending, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      console.log("Comment created:", data);
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error(
        "Failed to create comment:",
        error?.response?.data || error.message
      );
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ descp, postId });
    setDescp("");
  };
  console.log("currentUser:", currentUser);

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={descp}
          onChange={(e) => setDescp(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {isPending
        ? "Loading"
        : data.map((comment) => (
            <div className="comment">
              <img src={comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.descp}</p>
              </div>
              <span className="date">
                {moment(comment.createdat).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;

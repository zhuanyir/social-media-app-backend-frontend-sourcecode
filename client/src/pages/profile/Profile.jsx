import "./profile.scss";
import { useLocation } from "react-router-dom";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const { currentUser } = useContext(AuthContext);

  if (isNaN(userId)) {
    console.error("Invalid user ID from URL:", location.pathname); // 添加的验证userId有效性
    return <div>Invalid user profile</div>;
  }

  const { isPending, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get("/users/find?userId=" + userId).then((res) => {
        return res.data;
      }),
  });

  const { isPending: rIsPending, data: relationshipData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest.get("/relationships?followeduserId=" + userId).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships?userId=" + userId);
    },
    onSuccess: (relationshipData) => {
      // Invalidate and refetch
      console.log("Following created:", relationshipData);
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
    onError: (error) => {
      console.error(
        "Failed to follow:",
        error?.response?.data || error.message
      );
    },
  });

  const handleFollow = () => {
    if (!Array.isArray(relationshipData)) return;
    mutation.mutate(relationshipData?.includes(currentUser.id));
  };

  console.log(data);

  if (isPending) return <div>Loading profile...</div>;
  if (error) return <div>Failed to load user</div>;

  return (
    <div className="profile">
      <div className="images">
        <img
          src={
            data?.coverPic?.startsWith("http")
              ? data.coverPic
              : "/upload/" + data.coverPic
          }
          alt=""
          className="cover"
        />
        <img
          src={
            data?.profilePic?.startsWith("http")
              ? data.profilePic
              : "/upload/" + data.profilePic
          }
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookOutlinedIcon style={{ fontSize: 30 }} />
            </a>
            <a href="https://www.instagram.com/">
              <InstagramIcon fontSize="medium" />
            </a>
            <a href="https://x.com/">
              <TwitterIcon style={{ fontSize: 30 }} />
            </a>
            <a href="https://www.linkedin.com/">
              <LinkedInIcon style={{ fontSize: 30 }} />
            </a>
            <a href="https://www.pinterest.com/">
              <PinterestIcon style={{ fontSize: 30 }} />
            </a>
          </div>
          <div className="center">
            <span>{data?.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
            {rIsPending ? (
              "Loading"
            ) : userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>update</button>
            ) : (
              <button onClick={handleFollow}>
                {Array.isArray(relationshipData) &&
                relationshipData.includes(currentUser.id)
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;

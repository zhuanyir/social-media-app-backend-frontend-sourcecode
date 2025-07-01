import "./navBar.scss";
import { Link } from "react-router-dom";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import DarkModeTwoToneIcon from "@mui/icons-material/DarkModeTwoTone";
import AppsTwoToneIcon from "@mui/icons-material/AppsTwoTone";
import WbSunnyTwoToneIcon from "@mui/icons-material/WbSunnyTwoTone";
import NotificationsTwoToneIcon from "@mui/icons-material/NotificationsTwoTone";
import MailTwoToneIcon from "@mui/icons-material/MailTwoTone";
import PersonOutlineTwoToneIcon from "@mui/icons-material/PersonOutlineTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const NavBar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
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

  return (
    <div className="navBar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>ConnectSphere</span>
        </Link>
        <HomeTwoToneIcon />
        {!darkMode ? (
          <DarkModeTwoToneIcon onClick={toggle} />
        ) : (
          <WbSunnyTwoToneIcon onClick={toggle} />
        )}
        <AppsTwoToneIcon />
        <div className="search">
          <SearchTwoToneIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlineTwoToneIcon />
        <MailTwoToneIcon />
        <NotificationsTwoToneIcon />
        <div className="user">
          <img
            src={
              user.profilePic?.startsWith("http")
                ? user.profilePic
                : `/upload/${user.profilePic}`
            }
            alt="sunflower"
          />
          <span>{user.name}</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

import "./update.scss";
import { useState, useEffect, useContext } from "react";
import { makeRequest } from "../../axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const { setCurrentUser } = useContext(AuthContext);
  const [texts, setTexts] = useState({
    name: "",
    city: "",
    website: "",
  });

  // 初始化表单值
  useEffect(() => {
    if (user) {
      setTexts({
        name: user.name || "",
        city: user.city || "",
        website: user.website || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userData) => {
      return makeRequest.put("/users", userData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      setCurrentUser(res.data);
      console.log("User has been updated:", data);
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpenUpdate(false);
    },
    onError: (error) => {
      console.error(
        "Failed to create post:",
        error?.response?.data || error.message
      );
    },
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const coverUrl = cover ? await upload(cover) : user.coverPic;
    const profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
  };

  return (
    <div className="update">
      Update
      <form>
        <input type="file" onChange={(e) => setCover(e.target.files[0])} />
        <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
        <input
          type="text"
          name="name"
          value={texts.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          value={texts.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="website"
          value={texts.website}
          onChange={handleChange}
        />
        <button onClick={handleClick}>Update</button>
      </form>
      <button onClick={() => setOpenUpdate(false)}> X</button>
    </div>
  );
};

export default Update;

import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res) => {
  try {
    const q = "SELECT userid FROM likes WHERE postid=$1";
    const result = await db.query(q, [req.query.postId]);
    res.status(200).json(result.rows.map((like) => like.userid));
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

export const addLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    // console.log(userInfo);

    const q = `
      INSERT INTO likes ("userid", "postid")
      VALUES ($1, $2) 
      `;

    const values = [userInfo.id, req.body.postId];

    await db.query(q, values);
    res.status(200).json("Post has been liked!");
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

export const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    console.log(userInfo);

    const q = `
      DELETE FROM likes WHERE "userid"=$1 AND "postid"=$2
      `;

    await db.query(q, [userInfo.id, req.query.postId]);
    res.status(200).json("Post has been disliked!");
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");

    const q = userId
      ? `SELECT p.*, u.id AS "userId",  u.name,  u."profilePic" 
      FROM posts AS p 
      JOIN users AS u ON u.id = p."userId"
      WHERE p."userId"=$1 ORDER BY p.createdat DESC`
      : `
      SELECT p.*, u.id AS "userId",  u.name,  u."profilePic" 
      FROM posts AS p 
      JOIN users AS u ON u.id = p."userId"
      LEFT JOIN relationships AS r ON p."userId" = r.followeduserid  
      WHERE r.followeruserid= $1 OR p."userId" = $1
      ORDER BY p.createdat DESC
      `;
    const values = userId ? [userId] : [userInfo.id];

    const result = await db.query(q, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

export const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    console.log(userInfo);

    const q = `
      INSERT INTO posts ("descp", "img", "createdat", "userId")
      VALUES ($1, $2, $3, $4) 
      `;

    const values = [
      req.body.descp,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    await db.query(q, values);
    res.status(200).json("Post has been created!");
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    console.log(userInfo);

    const q = `
      DELETE FROM posts WHERE "id"=$1 AND "userId"=$2
      `;

    const result = await db.query(q, [req.params.id, userInfo.id]);
    if (result.rowCount > 0) {
      return res.status(200).json("Post has been deleted!");
    } else {
      return res.status(403).json("You can only delete your post!");
    }
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

// jwt.verify(token,"secretkey", (err, userInfo) => {
//   if (err) return res.status(403).json("Token is not valid!");

// })

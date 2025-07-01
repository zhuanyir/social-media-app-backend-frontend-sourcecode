import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = async (req, res) => {
  try {
    const q = `
      SELECT c.*, u.id AS "userId",  u.name,  u."profilePic" 
      FROM comments AS c 
      JOIN users AS u ON u.id = c.userid
      WHERE c."postId" = $1
      ORDER BY c.createdat DESC
      `;

    const result = await db.query(q, [req.query.postId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("DB ERROR :", err); // add err log
    res.status(500).json(" DB error.");
  }
};

export const addComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    console.log(userInfo);

    const q = `
      INSERT INTO comments ("descp", "createdat", "userid", "postId")
      VALUES ($1, $2, $3, $4) 
      `;

    const values = [
      req.body.descp,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    await db.query(q, values);
    res.status(200).json("Comment has been created!");
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

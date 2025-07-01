import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = async (req, res) => {
  try {
    const q =
      "SELECT followeruserid FROM relationships WHERE followeduserid=$1";
    const result = await db.query(q, [req.query.followeduserId]);
    res
      .status(200)
      .json(result.rows.map((relathionship) => relathionship.followeruserid));
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

export const addRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    // console.log(userInfo);

    const q = `
      INSERT INTO relationships ("followeruserid", "followeduserid")
      VALUES ($1, $2) 
      `;

    const values = [userInfo.id, req.query.userId];

    await db.query(q, values);
    res.status(200).json("Following!");
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

export const deleteRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, "secretkey");
    console.log(userInfo);

    const q = `
      DELETE FROM relationships WHERE "followeruserid"=$1 AND "followeduserid"=$2
      `;

    await db.query(q, [userInfo.id, req.query.userId]);
    res.status(200).json("Unfollowing!");
  } catch (err) {
    console.error("DB ERROR or Token error:", err); // add err log
    res.status(403).json("Token is not valid or DB error.");
  }
};

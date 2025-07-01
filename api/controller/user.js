import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const userId = req.query.userId;
  const q = "SELECT * FROM users WHERE id= $1";

  const result = await db.query(q, [userId]);
  try {
    // const token = jwt.sign({ id: result.rows[0].id }, "secretkey");
    const { password, ...info } = result.rows[0];
    return res.json(info);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = await new Promise((resolve, reject) => {
      jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) return reject("Token is not valid or expired.");
        resolve(decoded);
      });
    });

    const q = `UPDATE users SET "name"= $1, "city"=$2, "website"=$3, "coverPic"=$4, "profilePic"=$5 WHERE id=$6 `;
    const values = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.coverPic,
      req.body.profilePic,
      userInfo.id,
    ];
    const result = await db.query(q, values);

    if (result.rowCount > 0) {
      return res.status(200).json("Updated!");
    } else {
      return res.status(403).json("You can update only your user!");
    }
  } catch (err) {
    console.error("Update failed:", err);
    return res.status(500).json(err.toString());
  }

  // const token = req.cookies.accessToken;
  // if (!token) return res.status(401).json("Not logged in!");

  // jwt.verify(token, "secretkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("Token is not valid or DB error.");
  //   const q = `UPDATE users SET "name"= $1, "city"=$2, "website"=$3, "profilePic"=$4, "coverPic"=$5 WHERE id=$6 `;

  //   db.query(
  //     q,
  //     [
  //       req.body.name,
  //       req.body.city,
  //       req.body.website,
  //       req.body.coverPic,
  //       req.body.profilePic,
  //       userInfo.id,
  //     ],
  //     (err, data) => {
  //       if (err) res.status(500).json(err);
  //       if (data.affectedRows > 0) return res.json("Updated!");
  //       return res.status(403).json("You can update only your user!");
  //     }
  //   );
  // });
};

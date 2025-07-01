import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // check user if exists
  const q = "SELECT * FROM users WHERE username = $1";
  db.query(q, [req.body.username], (err, result) => {
    if (err) return res.status(500).json(err); // database error
    if (result.rows.length) return res.status(409).json("User already exists!");

    //create a new user
    //hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const insertQuery =
      "INSERT INTO users (username, email, password, name) VALUES($1,$2,$3,$4)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    db.query(insertQuery, values, (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  console.log("Received login request:", req.body);

  const q = "SELECT * FROM users WHERE username = $1";
  db.query(q, [req.body.username], (err, result) => {
    if (err) return res.status(500).json(err);
    console.log("Query result:", result.rows); // for test
    if (result.rows.length === 0)
      return res.status(404).json("User not found!");

    console.log("Query result:", result.rows);

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      result.rows[0].password
    );
    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: result.rows[0].id }, "secretkey");
    const { password, ...others } = result.rows[0];

    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out!");
};

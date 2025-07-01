import pg from "pg";

export const db = new pg.Client({
      user: "postgres",
      host: "localhost",
      database: "react-social-app",
      password: "123321",
      port: 5432

});

db.connect();
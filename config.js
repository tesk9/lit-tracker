var conString;

if() {
  conString = process.env.DATABASE_URL || "postgres://tessakelly:1234@localhost/lit-tracker-db";
} else {
  conString = "postgres://tessakelly:1234@localhost/lit-tracker-db-test";
}
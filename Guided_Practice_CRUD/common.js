const pg = require("pg");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const client = new pg.Client(
  `postgres://postgres:${process.env.MY_PASSWORD}@localhost:5432/the_acme_notes_db`
);

module.exports = { express, client };

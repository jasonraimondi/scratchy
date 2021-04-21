
require("dotenv/config");

// @ts-check
const { Client } = require('pg')
const path = require("path");
const util = require("util");
const NodeEnvironment = require("jest-environment-node");
const exec = util.promisify(require("child_process").exec);
const crypto = require("crypto");

const prismaBinary = path.join(__dirname, "..", "node_modules/.bin/prisma");

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    const token = crypto.randomBytes(5).toString("hex");

    // Generate a unique schema identifier for this test context
    this.schema = `test_${token}`

    // Generate the pg connection string for the test schema
    this.connectionString = `${process.env.DATABASE_URL}?schema=${this.schema}`
    console.log(this.connectionString);
  }

  async setup() {
    // Set the required environment variable to contain the connection string
    // to our database test schema
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    console.log("SETUP =================================================")
    // Run the migrations to ensure our schema has the required structure
    await exec(`${prismaBinary} db push --preview-feature`);

    return super.setup()
  }

  async teardown() {
    console.log("TEARDOWN =================================================")

    // const client = new Client({
    //   connectionString: this.connectionString,
    // })
    // await client.connect()
    // await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    // await client.end()
    return super.teardown();
  }
}

module.exports = PrismaTestEnvironment;

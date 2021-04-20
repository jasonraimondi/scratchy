require("dotenv/config");

// @ts-check
const path = require("path");
const util = require("util");
const NodeEnvironment = require("jest-environment-node");
const exec = util.promisify(require("child_process").exec);

const prismaBinary = path.join(__dirname, "..", "node_modules/.bin/prisma");

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    process.env.DATABASE_URL = this.global.process.env.DATABASE_URL + "_testing"
  }

  async setup() {
    // Run the migrations to ensure our schema has the required structure
    await exec(`${prismaBinary} db push --preview-feature`);
    return super.setup();
  }

  async teardown() {
    return super.teardown();
  }
}

module.exports = PrismaTestEnvironment;

/**
 * Node.js script to build all packages
 */
const path = require("path");
const { exit } = require("process");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const basePackages = ["reltab", "aggtree"];
const driverPackages = [
  "reltab-sqlite",
  "reltab-duckdb",
  "reltab-fs",
  "reltab-aws-athena",
  "reltab-bigquery",
  "reltab-snowflake",
];
const componentPackages = ["tadviewer"];
const appPackages = ["tadweb-app", "tadweb-server", "tad-app"];
const allPackages = basePackages.concat(
  driverPackages,
  componentPackages,
  appPackages
);
const desktopPackages = basePackages.concat(
  driverPackages,
  componentPackages,
  ["tad-app"]
);

function getPackagesToBuild() {
  const mode = process.argv[2] || "--all";
  if (mode === "--all") {
    return allPackages;
  }
  if (mode === "--desktop") {
    return desktopPackages;
  }
  console.error(`unknown build mode: ${mode}`);
  console.error("usage: node tools/buildAll.js [--all|--desktop]");
  exit(1);
}

async function main() {
  for (const pkg of getPackagesToBuild()) {
    console.log(`building: ${pkg}:`);
    const pkgDir = path.join(process.cwd(), "packages", pkg);
    const { error, stdout, stderr } = await exec("npm run build", {
      cwd: pkgDir,
    });

    console.log(stdout);
    console.error(stderr);
    if (error) {
      console.error(`error building ${pkg}:`);
      console.error(error);
      exit(1);
    }
  }
}

main();

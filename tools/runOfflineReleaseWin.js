const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function assertExists(targetPath, description) {
  if (!fs.existsSync(targetPath)) {
    console.error(`missing ${description}: ${targetPath}`);
    process.exit(1);
  }
}

const repoDir = path.resolve(__dirname, "..");
const tadAppDir = path.join(repoDir, "packages", "tad-app");
const offlineCacheDir = path.join(repoDir, "vendor", "electron-builder-cache");
const nsisDir = path.join(offlineCacheDir, "nsis", "nsis-3.0.4.1");
const nsisResourcesDir = path.join(
  offlineCacheDir,
  "nsis",
  "nsis-resources-3.4.1"
);
const electronDistDir = path.join(repoDir, "node_modules", "electron", "dist");
const electronExe = path.join(electronDistDir, "electron.exe");

assertExists(tadAppDir, "tad-app package directory");
assertExists(offlineCacheDir, "offline electron-builder cache");
assertExists(nsisDir, "offline NSIS directory");
assertExists(nsisResourcesDir, "offline NSIS resources directory");
assertExists(electronDistDir, "local Electron distribution directory");
assertExists(electronExe, "local Electron executable");

const electronBuilderCli = require.resolve("electron-builder/cli.js", {
  paths: [tadAppDir],
});

const result = spawnSync(
  process.execPath,
  [
    electronBuilderCli,
    "--win",
    "portable",
    "--x64",
    "--publish=never",
    "--config.npmRebuild=false",
    "--config.win.signAndEditExecutable=false",
    `--config.electronDist=${electronDistDir}`,
  ],
  {
    cwd: tadAppDir,
    stdio: "inherit",
    env: {
      ...process.env,
      ELECTRON_BUILDER_CACHE: offlineCacheDir,
      ELECTRON_BUILDER_NSIS_DIR: nsisDir,
    },
  }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status == null ? 1 : result.status);

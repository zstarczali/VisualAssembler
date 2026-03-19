const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { app, BrowserWindow, dialog, ipcMain, shell, Menu } = require("electron");

function getConfigPath() {
  return path.join(app.getPath("userData"), "config.json");
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(getConfigPath(), "utf8"));
  } catch {
    return {};
  }
}

function writeConfig(nextConfig) {
  fs.mkdirSync(path.dirname(getConfigPath()), { recursive: true });
  fs.writeFileSync(getConfigPath(), JSON.stringify(nextConfig, null, 2), "utf8");
}

function detectViceExecutable() {
  const candidates = [
    "C:\\Program Files\\GTK3VICE-3.9\\bin\\x64sc.exe",
    "C:\\Program Files\\GTK3VICE-3.8\\bin\\x64sc.exe",
    "C:\\Program Files\\WinVICE\\x64sc.exe",
    "C:\\Program Files (x86)\\WinVICE\\x64sc.exe"
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

ipcMain.handle("window:set-title", (_event, title) => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) win.setTitle(title);
});

ipcMain.handle("shell:open-external", (_event, url) => {
  shell.openExternal(url);
});

ipcMain.handle("app:quit", () => {
  app.quit();
});

ipcMain.handle("app:get-version", () => {
  return app.getVersion();
});

ipcMain.handle("vice:get-config", async () => {
  const config = readConfig();
  return {
    vicePath: config.vicePath || detectViceExecutable()
  };
});

ipcMain.handle("include:choose-file", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select project file to include",
    properties: ["openFile"],
    filters: [
      { name: "C64 Visual Assembler project", extensions: ["json"] },
      { name: "All files", extensions: ["*"] }
    ]
  });
  if (result.canceled || !result.filePaths.length) return { canceled: true };
  try {
    const filePath = result.filePaths[0];
    const raw = fs.readFileSync(filePath, "utf8");
    const project = JSON.parse(raw);
    if (project.app !== "c64-visual-assembler" || !Array.isArray(project.program)) {
      return { canceled: false, error: "Not a valid C64 Visual Assembler project." };
    }
    return { canceled: false, filePath, fileName: path.basename(filePath), blocks: project.program };
  } catch (error) {
    return { canceled: false, error: error.message || "Failed to read file." };
  }
});

ipcMain.handle("include:reload-file", async (_event, filePath) => {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const project = JSON.parse(raw);
    if (project.app !== "c64-visual-assembler" || !Array.isArray(project.program)) {
      return { error: "Not a valid C64 Visual Assembler project." };
    }
    return { fileName: path.basename(filePath), blocks: project.program };
  } catch (error) {
    return { error: error.message || "Failed to read file." };
  }
});

ipcMain.handle("incbin:load-sample-file", async (_event, fileName) => {
  try {
    const filePath = path.join(__dirname, "samples", fileName);
    if (!fs.existsSync(filePath)) {
      return { error: "Sample file not found: " + fileName };
    }
    const buf = fs.readFileSync(filePath);
    return {
      fileName,
      filePath,
      bytes: Array.from(buf)
    };
  } catch (error) {
    return { error: error.message || "Failed to read sample file." };
  }
});

ipcMain.handle("incbin:choose-file", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select binary file to include",
    properties: ["openFile"],
    filters: [
      { name: "Binary files", extensions: ["bin", "prg", "sid", "raw"] },
      { name: "All files", extensions: ["*"] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  try {
    const filePath = result.filePaths[0];
    const buf = fs.readFileSync(filePath);
    return {
      canceled: false,
      filePath,
      fileName: path.basename(filePath),
      bytes: Array.from(buf)
    };
  } catch (error) {
    return {
      canceled: false,
      error: error.message || "Failed to read file."
    };
  }
});

ipcMain.handle("vice:choose-executable", async () => {
  const isMac = process.platform === "darwin";
  
  const result = await dialog.showOpenDialog({
    title: "Valaszd ki a VICE executable fajlt",
    properties: ["openFile"],
    filters: isMac ? [] : [
      { name: "Executable", extensions: ["exe"] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const config = readConfig();
  config.vicePath = result.filePaths[0];
  writeConfig(config);

  return {
    canceled: false,
    vicePath: config.vicePath
  };
});

ipcMain.handle("vice:launch", async (_event, payload) => {
  const config = readConfig();
  let vicePath = config.vicePath || detectViceExecutable();

  if (!vicePath || !fs.existsSync(vicePath)) {
    return {
      ok: false,
      error: "VICE executable nincs beallitva vagy nem talalhato."
    };
  }

  const tempDir = path.join(os.tmpdir(), "c64-visual-assembler");
  fs.mkdirSync(tempDir, { recursive: true });
  const fileName = payload?.fileName || `program-${Date.now()}.prg`;
  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(payload.bytes));

  try {
    let child;
    
    if (process.platform === "darwin") {
      // Mac: use 'open' with the .app bundle to properly launch VICE with the file
      const appPath = vicePath.endsWith(".app") 
        ? vicePath 
        : vicePath.includes("/Contents/MacOS/") 
          ? vicePath.split("/Contents/MacOS/")[0] + ".app"
          : vicePath;
      
      child = spawn("open", ["-a", appPath, filePath], {
        detached: true,
        stdio: "ignore"
      });
    } else {
      // Windows: direct launch with file argument
      child = spawn(vicePath, [filePath], {
        detached: true,
        stdio: "ignore"
      });
    }
    
    child.unref();

    return {
      ok: true,
      vicePath,
      filePath
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "VICE inditas sikertelen."
    };
  }
});

ipcMain.handle("project:save", async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: "Save C64 Visual Assembler Project",
    defaultPath: `c64-project-${Date.now()}.c64va.json`,
    filters: [
      { name: "C64 Visual Assembler Project", extensions: ["json", "c64va"] },
      { name: "JSON", extensions: ["json"] }
    ]
  });

  if (result.canceled || !result.filePath) {
    return { canceled: true };
  }

  try {
    fs.writeFileSync(result.filePath, JSON.stringify(payload, null, 2), "utf8");
    return {
      ok: true,
      filePath: result.filePath
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Saving project failed."
    };
  }
});

ipcMain.handle("project:load", async () => {
  const result = await dialog.showOpenDialog({
    title: "Open C64 Visual Assembler Project",
    properties: ["openFile"],
    filters: [
      { name: "C64 Visual Assembler Project", extensions: ["json", "c64va"] },
      { name: "JSON", extensions: ["json"] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  try {
    const filePath = result.filePaths[0];
    const raw = fs.readFileSync(filePath, "utf8");
    return {
      ok: true,
      filePath,
      project: JSON.parse(raw)
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Loading project failed."
    };
  }
});

ipcMain.handle("sample:load", async (_event, sampleName) => {
  try {
    const samplePath = path.join(__dirname, "samples", `${sampleName}.json`);
    if (!fs.existsSync(samplePath)) {
      return { ok: false, error: "Sample not found." };
    }
    const raw = fs.readFileSync(samplePath, "utf8");
    return {
      ok: true,
      sample: JSON.parse(raw)
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message || "Loading sample failed."
    };
  }
});

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 980,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: "#2f2a8a",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "build", "commodore64.ico"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.setTitle("C64 Visual Assembler");
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([]));
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

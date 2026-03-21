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
    const fileName = path.basename(filePath).replace(/\.json$/i, '');
    return { canceled: false, filePath, fileName, blocks: project.program };
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
    return { fileName: path.basename(filePath).replace(/\.json$/i, ''), blocks: project.program };
  } catch (error) {
    return { error: error.message || "Failed to read file." };
  }
});

function parseSidBuffer(buf) {
  const magic = buf.slice(0, 4).toString("ascii");
  if (magic !== "PSID" && magic !== "RSID") {
    return { error: "Not a valid SID file (missing PSID/RSID header)." };
  }
  const dataOffset = (buf[6] << 8) | buf[7];
  let loadAddress  = (buf[8] << 8) | buf[9];
  const initAddress = (buf[10] << 8) | buf[11];
  const playAddress = (buf[12] << 8) | buf[13];
  const numSongs    = (buf[14] << 8) | buf[15];
  const startSong   = (buf[16] << 8) | buf[17];

  let title = ""; for (let i = 22; i < 54 && buf[i]; i++) title += String.fromCharCode(buf[i]);
  let author = ""; for (let i = 54; i < 86 && buf[i]; i++) author += String.fromCharCode(buf[i]);
  let copyright = ""; for (let i = 86; i < 118 && buf[i]; i++) copyright += String.fromCharCode(buf[i]);

  let dataBytes = buf.slice(dataOffset);
  if (loadAddress === 0) {
    loadAddress = dataBytes[0] | (dataBytes[1] << 8);
    dataBytes = dataBytes.slice(2);
  }
  return { loadAddress, initAddress, playAddress, numSongs, startSong, title, author, copyright, bytes: Array.from(dataBytes) };
}

ipcMain.handle("sid:choose-file", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select SID file",
    properties: ["openFile"],
    filters: [
      { name: "SID files", extensions: ["sid"] },
      { name: "All files", extensions: ["*"] }
    ]
  });
  if (result.canceled || !result.filePaths.length) return { canceled: true };
  try {
    const filePath = result.filePaths[0];
    const buf = fs.readFileSync(filePath);
    const parsed = parseSidBuffer(buf);
    if (parsed.error) return { canceled: false, error: parsed.error };
    return { canceled: false, filePath, fileName: path.basename(filePath), ...parsed };
  } catch (error) {
    return { canceled: false, error: error.message || "Failed to read SID file." };
  }
});

ipcMain.handle("sid:load-sample-file", async (_event, fileName) => {
  try {
    const filePath = path.join(__dirname, "samples", fileName);
    if (!fs.existsSync(filePath)) return { error: "Sample SID file not found: " + fileName };
    const buf = fs.readFileSync(filePath);
    const parsed = parseSidBuffer(buf);
    if (parsed.error) return { error: parsed.error };
    return { filePath, fileName, ...parsed };
  } catch (error) {
    return { error: error.message || "Failed to read SID file." };
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

ipcMain.handle("prg:save", async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: "Save PRG file",
    defaultPath: `c64-program-${Date.now()}.prg`,
    filters: [
      { name: "Commodore 64 PRG", extensions: ["prg"] },
      { name: "All files", extensions: ["*"] }
    ]
  });

  if (result.canceled || !result.filePath) return { canceled: true };

  try {
    fs.writeFileSync(result.filePath, Buffer.from(payload.bytes));
    return { ok: true, filePath: result.filePath };
  } catch (error) {
    return { ok: false, error: error.message || "Saving PRG failed." };
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
  // Keep a minimal Edit menu so Ctrl+C/V/X/Z work reliably in the renderer
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    }
  ]));
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

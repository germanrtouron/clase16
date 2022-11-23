const fs = require("fs");
const path = require("path");
const files = path.join(__dirname, "../files");

class ChatContainer {
  constructor(fileName) {
    this.file = `${files}/${fileName}`;
  }

  async save(data) {
    try {
      if (!fs.existsSync(this.file)) {
        this.fsWriteFile([data]);
        return;
      }
      const fileContent = await this.getAll();
      if (fileContent.length === 0) {
        this.fsWriteFile([data]);
        return;
      }
      fileContent.push(data);
      this.fsWriteFile(fileContent);
    } catch {
      return Error("error saving history chat");
    }
  }

  async getAll() {
    try {
      if (!fs.existsSync(this.file)) {
        return "";
      }
      const fileContent = await fs.promises.readFile(this.file, "utf-8");
      if (fileContent.length === 0) {
        return "";
      }
      const fileContentJSON = JSON.parse(fileContent);
      return fileContentJSON;
    } catch {
      return Error("error reading history chat.");
    }
  }

  async fsWriteFile(data) {
    await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2));
  }
}

module.exports = ChatContainer;

const fs = require("fs");
const path = require("path");
const files = path.join(__dirname, "../files");

class ChatContainer {
  static history = [];
  constructor(fileName) {
    this.file = `${files}/${fileName}`;
  }
  async save(data) {
    try {
      if (fs.existsSync(this.file)) {
        const fileContent = await this.getAll();
        if (fileContent.length > 0) {
          fileContent.push(data);
          await fs.promises.writeFile(
            this.file,
            JSON.stringify(fileContent, null, 2)
          );
        } else {
          ChatContainer.history.push(data);
          await fs.promises.writeFile(
            this.file,
            JSON.stringify(ChatContainer.history, null, 2)
          );
        }
      } else {
        ChatContainer.history.push(data);
        await fs.promises.writeFile(
          this.file,
          JSON.stringify(ChatContainer.history, null, 2)
        );
      }
    } catch {
      return Error("error saving history chat");
    }
  }
  async getAll() {
    try {
      const fileContent = await fs.promises.readFile(this.file, "utf-8");
      if (fileContent.length > 0) {
        const fileContentJSON = JSON.parse(fileContent);
        return fileContentJSON;
      } else {
        return [];
      }
    } catch {
      return Error("error reading history chat");
    }
  }
}

module.exports = ChatContainer;

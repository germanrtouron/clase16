// DOM input chat
const chatInput = document.getElementById("chatInput");

// input chat events
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && chatInput.value) {
    event.preventDefault();
    const date = new Date();
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    const chatMessage = {
      user: user,
      date: `[${new Intl.DateTimeFormat("es-AR", options).format(date)}]`,
      message: chatInput.value,
    };
    socketClient.emit("newMessage", chatMessage);
    chatInput.value = "";
  }
});

// DOM chat messages content
const chatContent = document.getElementById("chatContent");

// receive messages from backend and render it in DOM
socketClient.on("chatContent", async (data) => {
  const templateChat = await fetch("./templates/chatContent.handlebars");
  const templateChatFormat = await templateChat.text();
  const template = Handlebars.compile(templateChatFormat);
  const html = template({ chat: data });
  chatContent.innerHTML = html;
  const cardBody = document.getElementById("cardBody");
  chatContent.scrollTop = cardBody.scrollHeight;
});

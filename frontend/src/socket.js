const token = localStorage.getItem("accessToken");

let selectedUserId = null;
const payload = JSON.parse(atob(token.split(".")[1]));
const loggedInUserId = payload.userId;
let socket = null;
if (!token) {
  window.location.href = "login.html";
} else {
  socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log(" Socket connected:", socket.id);
  });

  socket.emit("join-chat", loggedInUserId);
}

function appendMessage(text, isMe) {
  const container = document.getElementById("chatMessages");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");

  if (isMe) {
    msgDiv.classList.add("sent"); // RIGHT
  } else {
    msgDiv.classList.add("received"); // LEFT
  }

  msgDiv.innerText = text;
  container.appendChild(msgDiv);

  container.scrollTop = container.scrollHeight;
}
// Receiver only
socket.on("receive-message", (msg) => {
  if (msg.senderId === selectedUserId) {
    appendMessage(msg.text, false); // LEFT WHITE
  }
});
// Sender only
socket.on("message-sent", (msg) => {
  appendMessage(msg.text, true); // RIGHT GREEN
});

//  Load users
async function loadUsers() {
  const res = await fetch("http://localhost:3000/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await res.json();
  const usersList = document.getElementById("usersList");

  users.forEach((user) => {
    const div = document.createElement("div");
    div.className = "user";
    div.innerText = user.name;
    div.onclick = () => openChat(user);
    usersList.appendChild(div);
  });
}

function openChat(user) {
  selectedUserId = user._id;
  document.getElementById("chatHeader").innerText = `Chat with ${user.name}`;
  document.getElementById("chatMessages").innerHTML = "";
  loadMessages();
}

// Load messages
async function loadMessages() {
  const res = await fetch(`http://localhost:3000/api/chat/${selectedUserId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const chatData = await res.json();
  const container = document.getElementById("chatMessages");
  //console.log("messages", chatData);

  chatData.messages.forEach((msg) => {
    const isMe = msg.senderId === loggedInUserId;
    appendMessage(msg.text, isMe);
  });

  container.scrollTop = container.scrollHeight;
}

// Send message
async function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text || !selectedUserId) return;

  const data = await fetch("http://localhost:3000/api/chat/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      receiverId: selectedUserId,
      text,
    }),
  });
  // console.log("=====>", data);
  input.value = "";
  loadMessages();
}

loadUsers();
// logout function
async function logOut() {
  // Remove auth token
  //localStorage.removeItem("accessToken");

  // Disconnect socket
  if (window.socket) {
    // socket?.disconnect();
  }
  resp = await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  // Redirect to login page
  window.location.href = "/login.html";
}

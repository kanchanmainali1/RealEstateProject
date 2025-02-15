import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = parseInt(req.userId); // Ensure ID is integer
  const chatId = parseInt(req.params.chatId);
  const { text } = req.body;

  try {
    

    // Fetch chat including users
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true },
    });

    console.log("Fetched chat:", chat);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    const isUserInChat = chat.users.some((user) => user.id === tokenUserId);
    console.log("User in chat:", isUserInChat);

    if (!isUserInChat) {
      return res.status(403).json({ message: "Unauthorized!" });
    }

    // Create new message
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // Update chat seen status and last message
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: { push: tokenUserId }, // Ensures it's an array
        lastMessage: text,
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};

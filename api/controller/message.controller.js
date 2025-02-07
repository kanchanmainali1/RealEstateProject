import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = parseInt(req.userId, 10);
  const chatId = parseInt(req.params.chatId, 10);
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true },
    });

    if (!chat || !chat.users.some(user => user.id === tokenUserId)) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: { set: [tokenUserId] },
        lastMessage: text,
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};

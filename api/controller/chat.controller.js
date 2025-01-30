import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: { id: tokenUserId }, 
        },
      },
      include: {
        users: { 
          select: { id: true, username: true, avatar: true } 
        },
      },
    });

   
    chats.forEach((chat) => {
      chat.receiver = chat.users.find((user) => user.id !== tokenUserId);
    });

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: req.params.id },
      include: {
        users: { 
          select: { id: true, username: true, avatar: true } 
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat || !chat.users.some((user) => user.id === tokenUserId)) {
      return res.status(403).json({ message: "Unauthorized or chat not found" });
    }

    await prisma.chat.update({
      where: { id: req.params.id },
      data: {
        seenBy: { push: tokenUserId },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  try {
    const newChat = await prisma.chat.create({
      data: {
        users: {
          connect: [{ id: tokenUserId }, { id: receiverId }], // ✅ FIXED
        },
      },
      include: {
        users: { 
          select: { id: true, username: true, avatar: true } 
        },
      },
    });

    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: { id: req.params.id },
      data: {
        seenBy: { push: tokenUserId },
      },
      include: {
        users: { select: { id: true } },
      },
    });

    if (!chat.users.some((user) => user.id === tokenUserId)) {
      return res.status(403).json({ message: "Unauthorized to mark chat as read" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};

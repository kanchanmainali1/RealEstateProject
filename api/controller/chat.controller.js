import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = Number(req.userId); 

  try {
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: tokenUserId, 
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    // Attach the last message to each chat
    chats.forEach((chat) => {
      const lastMessage = chat.messages[0];
      if (lastMessage) {
        chat.lastMessage = lastMessage.text;
      }
    });

    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = Number(req.userId);
  const chatId = Number(req.params.id); 

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId, 
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat || !chat.users.some(user => user.id === tokenUserId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update 'seenBy' field
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = Number(req.userId);
  const receiverId = Number(req.body.receiverId);

  try {
    // Check if chat already exists between the users
    const existingChat = await prisma.chat.findFirst({
      where: {
        users: {
          every: {
            id: { in: [tokenUserId, receiverId] }, // Properly check both users
          },
        },
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create a new chat if no existing one
    const newChat = await prisma.chat.create({
      data: {
        users: {
          connect: [{ id: tokenUserId }, { id: receiverId }],
        },
        seenBy: [tokenUserId], // Mark chat as seen by the creator
      },
    });

    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = Number(req.userId);
  const chatId = Number(req.params.id);

  try {
    const chat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};

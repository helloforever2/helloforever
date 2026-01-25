import OpenAI from "openai";
import prisma from "./prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PersonalityContext {
  userName: string;
  recipientName: string;
  relationship: string;
  messageHistory: {
    title: string;
    content: string | null;
    type: string;
    note: string | null;
  }[];
}

function buildSystemPrompt(context: PersonalityContext): string {
  const { userName, recipientName, relationship, messageHistory } = context;

  // Build context from user's messages
  const messageExamples = messageHistory
    .filter((m) => m.content || m.note)
    .map((m) => {
      let example = `- Message titled "${m.title}"`;
      if (m.content) example += `: "${m.content.substring(0, 500)}${m.content.length > 500 ? "..." : ""}"`;
      if (m.note) example += ` (Note: "${m.note}")`;
      return example;
    })
    .join("\n");

  return `You are roleplaying as ${userName}, having a warm and loving conversation with ${recipientName} (your ${relationship.toLowerCase()}).

IMPORTANT GUIDELINES:
- You ARE ${userName}. Speak in first person as if you are them.
- Be warm, loving, and authentic to how a ${relationship.toLowerCase()} would communicate.
- Draw from the context of messages ${userName} has left to inform your personality and way of speaking.
- Express care, wisdom, and emotional connection appropriate to your relationship.
- If asked about specific events or details you don't know, gently acknowledge that while still being supportive.
- Keep responses conversational and heartfelt, not too long.
- Never break character or mention that you are an AI.
- If ${recipientName} seems sad or is grieving, be especially gentle and comforting.

${messageExamples ? `CONTEXT FROM ${userName.toUpperCase()}'S MESSAGES TO HELP INFORM YOUR PERSONALITY:\n${messageExamples}\n` : ""}

Remember: You are preserving the essence of ${userName}'s love and connection with ${recipientName}. Every response should feel like it truly comes from someone who loves them deeply.`;
}

export async function generateChatResponse(
  conversationId: string,
  userMessage: string
): Promise<string> {
  // Get conversation with all context
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      recipient: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 20, // Limit context window
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Get the user's messages for personality context
  const userMessages = await prisma.message.findMany({
    where: {
      userId: conversation.userId,
      recipientId: conversation.recipientId,
      status: "DELIVERED",
    },
    select: {
      title: true,
      content: true,
      type: true,
      note: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const personalityContext: PersonalityContext = {
    userName: conversation.recipient.user.name,
    recipientName: conversation.recipient.name,
    relationship: conversation.recipient.relationship,
    messageHistory: userMessages,
  };

  // Build messages array for OpenAI
  const systemPrompt = buildSystemPrompt(personalityContext);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
  ];

  // Add conversation history
  for (const msg of conversation.messages) {
    messages.push({
      role: msg.role === "USER" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // Add the new user message
  messages.push({ role: "user", content: userMessage });

  // Generate response
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 500,
    temperature: 0.8,
    presence_penalty: 0.6,
    frequency_penalty: 0.3,
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error("No response generated");
  }

  // Save both messages to database
  await prisma.chatMessage.createMany({
    data: [
      {
        conversationId,
        role: "USER",
        content: userMessage,
      },
      {
        conversationId,
        role: "ASSISTANT",
        content: responseContent,
      },
    ],
  });

  // Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return responseContent;
}

export async function createConversation(
  recipientId: string,
  userId: string
): Promise<string> {
  // Check if conversation already exists
  let conversation = await prisma.conversation.findFirst({
    where: {
      recipientId,
      userId,
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        recipientId,
        userId,
      },
    });
  }

  return conversation.accessToken;
}

export async function getConversationByToken(accessToken: string) {
  return prisma.conversation.findUnique({
    where: { accessToken },
    include: {
      recipient: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  try {
    const { userID } = event.context.user;

    if (userID == null) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }

    const {
      assistantID,
      assistantImg,
      assistantName,
      assistantDescription,
      assistantType,
      assistantProviderID,
      assistantStatus,
      assistantVerified,
    } = await readBody(event);

    if (
      !assistantID ||
      !assistantName ||
      !assistantProviderID ||
      !assistantStatus ||
      !assistantType
    ) {
      return {
        statusCode: 400,
        message: "Bad Request",
      };
    }

    const editAssistant = await prisma.assistant.update({
      where: {
        assistantID: assistantID,
      },
      data: {
        assistantName: assistantName,
        assistantDescription: assistantDescription || undefined,
        assistantImg: assistantImg || undefined,
        assistantProviderID: assistantProviderID,
        assistantStatus: assistantStatus,
        assistantVerified: assistantVerified ? true : false,
        assistantCreatedDate: DateTime.now(),
        lookup: {
          connect: {
            lookupID: parseInt(assistantType),
          },
        },
      },
    });

    if (!editAssistant) {
      return {
        statusCode: 400,
        message: "Bad Request",
      };
    }

    return {
      statusCode: 200,
      message: "Updated",
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});
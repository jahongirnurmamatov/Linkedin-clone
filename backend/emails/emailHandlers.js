import { mailtrapClient, sender } from "../lib/mailtrap.js";
import {
  createCommentNotificationEmailTemplate,
  createConnectionAcceptedEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Unlinkedin",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "welcome",
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    throw error;
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  const receipent = [{ email: recipientEmail }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: receipent,
      subject: "New Comment on Your Post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: "comment_notification",
    });
  } catch (error) {
    throw error;
  }
};

export const sendConnectionAcceptedEmail = async({senderEmail, senderName,recipientName,profileUrl})=>{
  const recipient = [{ email: senderEmail }];
  try {
     const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: `${recipientName} has accepted your connection request`,
      html: createConnectionAcceptedEmailTemplate(senderName,recipientName,profileUrl),
      category: "connection_accepted",
     })
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}
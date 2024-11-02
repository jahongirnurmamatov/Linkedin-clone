import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const sendConenctionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }
    if (req.user.connections.includes(userId)) {
      return res.status(400).json({ message: "You are already connected" });
    }
    const existingRequest = await Connection.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }
    const connection = new Connection({
      sender: senderId,
      recipient: userId,
    });
    await connection.save();
    res.status(201).json({ message: "Connection request sent successfully!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptConnectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await Connection.findById(requestId)
      .populate("sender", "name username email")
      .populate("recipient", "name username email");

    if (!request) {
      return res.status(404).json({ message: "Request not found!" });
    }
    // check if the req is for the current user
    if (request.recipient._id.toString() === userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request!" });
    }
    // check if request pending
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }

    request.status = "accepted";
    await request.save();

    // updating users connections
    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });
    const notification = new Notification({
      recipient: request.sender._id,
      type: "connectionAccepted",
      relatedUser: userId,
    });
    await notification.save();
    res.json({ message: "Connection accepted successfully" });

    // todo send notification mail to sender
    const senderEmail = request.sender.email;
    const senderName = request.sender.name;
    const recipientName = request.recipient.name;
    const profileUrl =
      process.env.CLIENT_URL + "/profile/" + request.recipient.username;
    try {
      await sendConnectionAcceptedEmail(
        senderEmail,
        senderName,
        recipientName,
        profileUrl
      );
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const rejectConenctionRequest = async (req, res) => {
  try {
  } catch (error) {}
};
export const getConnectionRequests = async (req, res) => {
  try {
  } catch (error) {}
};
export const getConnections = async (req, res) => {
  try {
  } catch (error) {}
};
export const deleteConnection = async (req, res) => {
  try {
  } catch (error) {}
};
export const getConnectionStatus = async (req, res) => {
  try {
  } catch (error) {}
};
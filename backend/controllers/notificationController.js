import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const nofitications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name profilePicture username")
      .populate("relatedPost", "content image");
    res.status(200).json(nofitications);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    await Notification.findByIdAndDelete(notificationId);
    res.json({ message: "Notification deleted successfully!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

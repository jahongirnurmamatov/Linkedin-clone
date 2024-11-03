import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
import Post from "../models/Post.js";
import cloudinary from "../lib/cloudinary.js";

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: req.user.connections },
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getFeedPosts: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    let newPost;
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      newPost = new Post({
        content,
        image: result.secure_url,
        author: req.user._id,
      });
    } else {
      newPost = new Post({ content, author: req.user._id });
    }
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    // check if the current user is an author of the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the owner of the post" });
    }
    // todo remove image from cloudinary
    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post has been deleted successfully!" });
  } catch (error) {
    console.error("Error in deleting post: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline");

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getting post by Id: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
    ).populate("author", "name email username headline profilePicture");

    // create a notification if the comment owner is not the post owner
    if (post.author.toString() != req.user._id.toString()) {
      const newNotification = new Notification({
        receipent: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId,
      });
    }
    await newNotification.save();
    // to do send email
    try {
      const postUrl = process.env.CLIEN_URL + "/post/" + postId;
      await sendCommentNotificationEmail(
        post.author.email,
        post.author.name,
        req.user.name,
        postUrl,
        content
      );
    } catch (error) {
      console.log("Error in sending notification", error.message);
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in commenting on post: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);

      const newNotification = new Notification({
        receipent: post.author,
        type: "like",
        relatedUser: req.user._id,
        relatedPost: postId,
      });
      await newNotification.save();
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error in liking post" });
  }
};

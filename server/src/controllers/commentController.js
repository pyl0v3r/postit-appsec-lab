const Comment = require('../models/Comment');
const Post = require('../models/Post');
const sanitizeHtml = require('sanitize-html');
const securityLogger = require('../utils/securityLogger');

exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];

  if (!content || content.trim().length === 0) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Empty content on comments section',
      content,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({ message: 'Comment content is required' });
  }

  const cleanContent = sanitizeHtml(content, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
    allowedAttributes: {}
  });

  if (!cleanContent || cleanContent.trim().length === 0) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Disallowed or unsafe content on comments section',
      content,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({
      message: 'Comment contains disallowed or unsafe content'
    });
  }

  if (cleanContent.length > 500) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Comment too long',
      content: cleanContent,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({ message: 'Comment too long' });
  }
  const comment = await Comment.create({
    content: cleanContent,
    post: postId,
    author: req.user.userId
  });
  // Link comment to post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id }
  });

  res.status(201).json(comment);
};
exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId }).populate('author', 'username');
  res.json(comments);
};
exports.updateComment = async (req, res) => {
  const { content } = req.body;
  req.comment.content = content;
  await req.comment.save();
  res.status(200).json(req.comment);
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  } else {
    // Remove reference from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId }
    });
    await Comment.deleteOne({ _id: commentId });
    return res.status(200).json({ message: 'Comment deleted' });
  }

};

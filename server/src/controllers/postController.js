const Post = require('../models/Post');
const Comment = require('../models/Comment');
const sanitizeHtml = require('sanitize-html');
const securityLogger = require('../utils/securityLogger');

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  if (!content || content.trim().length === 0 || !title || title.trim().length === 0) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Empty content on posts section',
      content,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({ message: 'Post content is required' });
  }
  const cleanContent = sanitizeHtml(content, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
    allowedAttributes: {}
  });
  const cleanTitle = sanitizeHtml(title, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
    allowedAttributes: {}
  });

  if (!cleanContent || cleanContent.trim().length === 0 || !cleanTitle || cleanTitle.trim().length === 0) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Disallowed or unsafe content on posts section',
      content,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({
      message: 'Post contains disallowed or unsafe content'
    });
  }

  if (cleanContent.length > 500 || cleanTitle.length > 100) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Post too long',
      content,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({ message: 'Post too long' });
  }
  const post = await Post.create({
    title: cleanTitle,
    content: cleanContent,
    author: req.user.userId
  });

  res.status(201).json(post);
};

exports.getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'username')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: 'username' }
    });
  res.status(200).json(posts);
};

exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];
  const postId = req.params.postId;
  req.post.title = title;
  req.post.content = content;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  if (!content || content.trim().length === 0 || !title || title.trim().length === 0) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Empty content on update posts section',
      postId,
      content,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({ message: 'Post content is required' });
  }
  const cleanContent = sanitizeHtml(content, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
    allowedAttributes: {}
  });
  const cleanTitle = sanitizeHtml(title, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
    allowedAttributes: {}
  });

  if (!cleanContent || cleanContent.trim().length === 0 || !cleanTitle || cleanTitle.trim().length === 0) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Disallowed or unsafe content on posts section',
      postId,
      content,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({
      message: 'Post contains disallowed or unsafe content'
    });
  }

  if (cleanContent.length > 500 || cleanTitle.length > 100) {
    securityLogger.warn({
      eventType: 'POTENTIAL_INJECTION_ATTEMPT',
      reason: 'Post too long',
      postId,
      content,
      userId: req.user.userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    });

    return res.status(400).json({ message: 'Post too long' });
  }
  req.post.content = cleanContent;
  req.post.title = cleanTitle;
  await req.post.save();
  res.status(200).json(req.post);
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  // Delete all comments belonging to this post
  await Comment.deleteMany({ post: postId });
  await Post.deleteOne({ _id: postId });
  res.status(200).json({ message: 'Post deleted' });
};

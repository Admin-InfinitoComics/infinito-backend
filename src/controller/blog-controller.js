import BlogService from "../services/blog-service.js";
const blogservice = new BlogService();

// Create a new blog
const createBlog = async (req, res) => {
   try {
    const { title, subject, authorName , category, news, status } = req.body;

    const blogData = await blogservice.create({
      title,
      subject,
      authorName,
      category,
      news ,
      status
    });

    return res.status(201).json({
      success: true,
      message: "Successfully created blog",
      data: blogData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await blogservice.getAll();
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all blogs",
      data: allBlogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await blogservice.getById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Blog found",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update blog by ID
const updateBlog = async (req, res) => {
  try {
    const { title, subject, authorName, category, news, status } = req.body;

    const updatedBlog = await blogservice.update(req.params.id,{
      title,
      subject,
      authorName,
      category,
      news,
      status,
    });
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete blog by ID
const deleteBlog = async (req, res) => {
  try {
    await blogservice.delete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLatestBlogs = async (req, res) => {
  try {
    const latestBlogs = await blogservice.getLatest(req.body); // fetch latest 5
    return res.status(200).json({
      success: true,
      message: "Fetched latest blogs",
      blogs: latestBlogs,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getFoundationBlogs = async (req, res) => {
  try {
    const blogs = await blogservice.getByCategory("Foundation", 4);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Foundation blogs" });
  }
};

const getICBlogs = async (req, res) => {
  try {
    const blogs = await blogservice.getTopBlogsByCategory("IC", 4); // sorted by createdAt ascending
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching IC blogs" });
  }
}

const getBlogsById = async (req, res) => {
  try {
    const blog = await blogservice.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};


export default {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getLatestBlogs,
  getFoundationBlogs,
  getICBlogs,
  getBlogsById
};

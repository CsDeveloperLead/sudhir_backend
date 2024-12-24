import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { Blog } from "../models/blogs.model.js";
import { uploadOnCloudinary } from "../cloudinary.js";

//this logic is to add admin credentials to backend
export const addAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const admin = await Admin.create({
    email,
    password,
  });

  if (!admin) {
    return res.status(500).json({ error: "Failed to add admin" });
  }

  return res.status(200).json({ message: "Admin added successfully" });
};

// this logic is to login admin
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await Admin.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Admin does not Found" });
  }

  const isPasswordCorrect = await user.isPasswordValid(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Invalid Password" });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return res
    .status(200)
    .json({ message: "Authentication Complete", token, id: user._id });
};

export const addBlog = async (req, res) => {
    try {
      const { blogTitle, blogContent } = req.body;
  
      // Validate input
      if (!blogTitle || !blogContent || !req.files?.image) {
        return res.status(400).json({
          error: "Title, content, and image are required",
        });
      }
  
      // Get the uploaded image path
      const imagePath = req.files.image[0].path;

      console.log(imagePath);
  
      // Upload the image to Cloudinary
      const image = await uploadOnCloudinary(imagePath);

      console.log(image.secure_url);
      
  
      // Check if the upload was successful
      if (!image?.secure_url) {
        return res.status(500).json({
          error: "Failed to upload image",
        });
      }
  
      // Create the blog entry
      const blog = await Blog.create({
        title: blogTitle,
        content: blogContent,
        image: image.secure_url,
      });
  
      // Respond with success
      return res.status(201).json({
        message: "Blog created successfully",
        blog,
      });
    } catch (error) {
      console.error("Error adding blog:", error);
      return res.status(500).json({
        error: "An error occurred while creating the blog",
      });
    }
  };

// this is to get all blogs
export const getBlogs = async (req, res) => {
  const blog = await Blog.find();

  if (!blog) {
    return res.status(401).json({ error: "Blogs not founded" });
  }

  return res.status(200).json({ message: blog });
};

// to delete all blogs
export const deleteAllBlogs = async (req, res) => {
  const blog = await Blog.deleteMany();

  if (!blog) {
    return res.status(401).json({ error: "Blogs not founded" });
  }

  return res.status(200).json({ message: "all deleted" });
};

// this is to get single blog
export const getSingleBlog = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(401).json({ error: "Id not founded" });
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(401).json({ error: "Blogs not founded" });
  }

  return res.status(200).json({ message: blog });
};

// this is to delete single blog
export const deleteSingleBlog = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(401).json({ error: "Id not founded" });
  }

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return res.status(401).json({ error: "Blogs not founded" });
  }

  return res.status(200).json({ message: "Blog deleted Successfully" });
};

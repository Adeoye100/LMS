require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const { mockUsers, mockCourses } = require("./mock-data");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
if (!process.env.CLIENT_URL) {
  console.warn(
    `Warning: CLIENT_URL not set in .env file. Defaulting to ${CLIENT_URL}`
  );
}

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Auth routes - Mock implementation
app.post("/auth/register", async (req, res) => {
  const { userEmail, password, role } = req.body;

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.userEmail === userEmail);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // Create new user
  const newUser = {
    _id: `user_${Date.now()}`,
    userEmail,
    password, // In real app, this would be hashed
    role: role || "student",
    name: userEmail.split("@")[0],
    theme: "light", // Add a default theme for new users
  };

  mockUsers.push(newUser);

  res.json({
    success: true,
    message: "User registered successfully",
    data: {
      token: `mock_token_${Date.now()}`,
      user: {
        _id: newUser._id,
        userEmail: newUser.userEmail,
        role: newUser.role,
        name: newUser.name,
        theme: newUser.theme,
      },
    },
  });
});

app.post("/auth/login", async (req, res) => {
  const { userEmail, password } = req.body;

  const user = mockUsers.find(
    (u) => u.userEmail === userEmail && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token: `mock_token_${Date.now()}`,
      user: {
        _id: user._id,
        userEmail: user.userEmail,
        role: user.role,
        name: user.name,
        theme: user.theme,
      },
    },
  });
});

// Course routes - Mock implementation
app.get("/student/course/get", async (req, res) => {
  res.json({
    success: true,
    data: mockCourses,
  });
});

app.get("/student/course/get/details/:courseId", async (req, res) => {
  const course = mockCourses.find((c) => c._id === req.params.courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  res.json({
    success: true,
    data: {
      ...course,
      subtitle: "Learn the fundamentals and advanced concepts",
      description: "This is a comprehensive mock course designed for testing purposes. It covers all essential topics and provides hands-on experience.",
      objectives: "Master React fundamentals, Build real-world applications, Understand state management, Learn component best practices",
      date: "2024-01-15T10:30:00.000Z",
      primaryLanguage: "English",
      students: ["student1", "student2", "student3"],
      curriculum: [
        {
          _id: "lec1",
          title: "Introduction to React",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          freePreview: true,
          duration: "15:30"
        },
        {
          _id: "lec2",
          title: "Setting up the Development Environment",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          freePreview: false,
          duration: "12:45"
        },
        {
          _id: "lec3",
          title: "Components and Props",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          freePreview: true,
          duration: "18:20"
        }
      ],
      instructorId: "instructor123",
      instructorName: course.instructorName,
      image: course.image,
      pricing: course.pricing,
      title: course.title,
      category: course.category,
      _id: course._id
    },
  });
});

app.get("/student/course/purchase-info/:courseId/:studentId", async (req, res) => {
  // Mock response - student has not purchased this course
  res.json({
    success: true,
    data: false,
  });
});

// Mock auth check endpoint
app.get("/auth/check-auth", (req, res) => {
  // For mock purposes, always return authenticated if there's a token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    res.json({
      success: true,
      data: {
        user: mockUsers[0], // Return first user as example
        authenticate: true,
      },
    });
  } else {
    res.json({
      success: true,
      data: {
        user: null,
        authenticate: false,
      },
    });
  }
});

// Mock route to update user theme
app.put("/auth/user/theme", (req, res) => {
  const { userId, theme } = req.body;

  if (!theme || !["light", "dark"].includes(theme)) {
    return res.status(400).json({
      success: false,
      message: "Invalid theme. Must be 'light' or 'dark'.",
    });
  }

  const user = mockUsers.find((u) => u._id === userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.theme = theme;

  res.json({ success: true, message: `Theme updated to ${theme}` });
});

// Media upload endpoints - Mock implementation
app.post("/media/upload", async (req, res) => {
  // Mock single file upload
  const mockPublicId = `file_${Date.now()}`;
  const mockFileUrl = `https://mock-storage.com/uploads/${mockPublicId}`;
  
  res.json({
    success: true,
    data: {
      public_id: mockPublicId,
      secure_url: mockFileUrl,
      url: mockFileUrl,
      fileName: req.body?.fileName || 'uploaded-file.mp4',
      fileSize: req.body?.fileSize || 1024000,
    }
  });
});

app.post("/media/bulk-upload", async (req, res) => {
  // Mock bulk file upload
  const uploadedFiles = [];
  const fileCount = req.body?.files?.length || 3; // Mock 3 files if not specified
  
  for (let i = 0; i < fileCount; i++) {
    const mockPublicId = `file_${Date.now()}_${i}`;
    const mockFileUrl = `https://mock-storage.com/uploads/${mockPublicId}`;
    
    uploadedFiles.push({
      public_id: mockPublicId,
      secure_url: mockFileUrl,
      url: mockFileUrl,
      fileName: `video-${i + 1}.mp4`,
      fileSize: Math.floor(Math.random() * 5000000) + 1000000, // Random size 1-6MB
    });
  }
  
  res.json({
    success: true,
    data: {
      uploadedFiles,
      totalFiles: fileCount,
      successCount: fileCount,
      failedCount: 0,
    }
  });
});

app.delete("/media/delete/:id", async (req, res) => {
  // Mock file deletion
  const fileId = req.params.id;
  
  res.json({
    success: true,
    message: `File ${fileId} deleted successfully`,
    data: {
      fileId,
      deletedAt: new Date().toISOString(),
    }
  });
});

// Instructor course endpoints - Mock implementation
app.get("/instructor/course/get", async (req, res) => {
  // Mock instructor course list
  const mockCourses = [
    {
      _id: "instructor_course_1",
      title: "Advanced React Patterns",
      subtitle: "Master advanced React concepts",
      description: "A comprehensive course on advanced React patterns and best practices.",
      pricing: 199.99,
      image: "https://picsum.photos/400/300?random=6",
      category: "Web Development",
      status: "published",
      createdAt: "2024-01-10T10:00:00.000Z",
      students: ["student1", "student2"],
      curriculum: [
        {
          _id: "lec1",
          title: "Introduction to Advanced Patterns",
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          freePreview: true,
          duration: "15:30"
        }
      ]
    },
    {
      _id: "instructor_course_2",
      title: "Node.js API Development",
      subtitle: "Build scalable APIs with Node.js",
      description: "Learn to build robust and scalable APIs using Node.js and Express.",
      pricing: 149.99,
      image: "https://picsum.photos/400/300?random=7",
      category: "Backend",
      status: "draft",
      createdAt: "2024-01-12T14:30:00.000Z",
      students: [],
      curriculum: []
    }
  ];
  
  res.json({
    success: true,
    data: mockCourses
  });
});

app.post("/instructor/course/add", async (req, res) => {
  // Mock adding new course
  const newCourse = {
    _id: `instructor_course_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: "draft",
    students: [],
    curriculum: req.body?.curriculum || []
  };
  
  res.json({
    success: true,
    message: "Course added successfully",
    data: newCourse
  });
});

app.get("/instructor/course/get/details/:id", async (req, res) => {
  // Mock course details for instructor
  const courseId = req.params.id;
  
  const mockCourse = {
    _id: courseId,
    title: "Advanced React Patterns",
    subtitle: "Master advanced React concepts and best practices",
    description: "A comprehensive course covering advanced React patterns, performance optimization, and real-world applications.",
    pricing: 199.99,
    image: "https://picsum.photos/400/300?random=8",
    category: "Web Development",
    level: "Advanced",
    primaryLanguage: "English",
    objectives: "Master React hooks, Understand performance optimization, Build scalable applications, Learn testing strategies",
    date: "2024-01-15T10:30:00.000Z",
    status: "draft",
    students: ["student1", "student2"],
    curriculum: [
      {
        _id: "lec1",
        title: "Advanced Hooks Patterns",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        freePreview: true,
        duration: "18:45"
      },
      {
        _id: "lec2",
        title: "Performance Optimization",
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        freePreview: false,
        duration: "22:30"
      }
    ]
  };
  
  res.json({
    success: true,
    data: mockCourse
  });
});

app.put("/instructor/course/update/:id", async (req, res) => {
  // Mock updating course
  const courseId = req.params.id;
  
  res.json({
    success: true,
    message: "Course updated successfully",
    data: {
      _id: courseId,
      ...req.body,
      updatedAt: new Date().toISOString()
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "Mock server running",
    timestamp: new Date().toISOString(),
    mode: "development",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Mock server is now running on port ${PORT}`);
  console.log(`Mode: Development (Mock data)`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

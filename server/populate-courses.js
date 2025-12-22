require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/Course");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

async function populateCourses() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");

    // Clear existing courses
    await Course.deleteMany({});
    console.log("Cleared existing courses");

    // Create sample courses based on the Course model schema
    const sampleCourses = [
      {
        instructorId: "instructor123",
        instructorName: "John Doe",
        date: new Date("2024-01-15T10:30:00.000Z"),
        title: "React Fundamentals",
        category: "Web Development",
        level: "Beginner",
        primaryLanguage: "English",
        subtitle: "Learn the basics of React development",
        description:
          "This comprehensive course covers the fundamentals of React including components, props, state, and hooks. Perfect for beginners who want to start their journey in web development.",
        image:
          "https://picsum.photos/400/300?random=1",
        welcomeMessage:
          "Welcome to React Fundamentals! Let's start building amazing user interfaces.",
        pricing: 99.99,
        objectives:
          "Master React components, Understand state management, Learn hooks and lifecycle methods, Build real-world applications",
        students: [],
        curriculum: [
          {
            title: "Introduction to React",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "react_intro_video",
            freePreview: true,
          },
          {
            title: "Setting up Development Environment",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            public_id: "react_setup_video",
            freePreview: false,
          },
          {
            title: "Components and Props",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "react_props_video",
            freePreview: true,
          },
        ],
        isPublised: true,
      },
      {
        instructorId: "instructor456",
        instructorName: "Jane Smith",
        date: new Date("2024-01-16T14:20:00.000Z"),
        title: "Node.js Backend Development",
        category: "Backend",
        level: "Intermediate",
        primaryLanguage: "English",
        subtitle: "Build scalable backend APIs with Node.js and Express",
        description:
          "Master backend development with Node.js, Express, and MongoDB. Learn to build RESTful APIs, implement authentication, and deploy your applications.",
        image:
          "https://picsum.photos/400/300?random=2",
        welcomeMessage:
          "Welcome to Node.js Backend Development! Let's build powerful server-side applications.",
        pricing: 129.99,
        objectives:
          "Master Node.js fundamentals, Build RESTful APIs, Implement authentication, Learn database integration",
        students: [],
        curriculum: [
          {
            title: "Introduction to Node.js",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "nodejs_intro_video",
            freePreview: true,
          },
          {
            title: "Setting up Express Server",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            public_id: "express_setup_video",
            freePreview: false,
          },
          {
            title: "Database Integration with MongoDB",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "mongodb_integration_video",
            freePreview: true,
          },
        ],
        isPublised: true,
      },
      {
        instructorId: "instructor789",
        instructorName: "Mike Johnson",
        date: new Date("2024-01-17T09:15:00.000Z"),
        title: "Advanced JavaScript Concepts",
        category: "Programming",
        level: "Advanced",
        primaryLanguage: "English",
        subtitle: "Deep dive into advanced JavaScript patterns and concepts",
        description:
          "Explore advanced JavaScript concepts including closures, prototypes, async/await, and modern ES6+ features. Perfect for developers who want to level up their JavaScript skills.",
        image:
          "https://picsum.photos/400/300?random=3",
        welcomeMessage:
          "Welcome to Advanced JavaScript Concepts! Prepare to dive deep into JavaScript mastery.",
        pricing: 149.99,
        objectives:
          "Master closures and prototypes, Understand async programming, Learn modern ES6+ features, Build efficient code",
        students: [],
        curriculum: [
          {
            title: "Closures and Scope",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "closures_scope_video",
            freePreview: true,
          },
          {
            title: "Prototypes and Inheritance",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            public_id: "prototypes_inheritance_video",
            freePreview: false,
          },
          {
            title: "Async/Await and Promises",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "async_await_video",
            freePreview: true,
          },
        ],
        isPublised: true,
      },
      {
        instructorId: "instructor101",
        instructorName: "Sarah Williams",
        date: new Date("2024-01-18T11:45:00.000Z"),
        title: "CSS3 and Responsive Design",
        category: "Design",
        level: "Beginner",
        primaryLanguage: "English",
        subtitle: "Create beautiful and responsive websites with CSS3",
        description:
          "Learn modern CSS3 techniques, Flexbox, Grid, and responsive design principles. Build stunning websites that look great on all devices.",
        image:
          "https://picsum.photos/400/300?random=4",
        welcomeMessage:
          "Welcome to CSS3 and Responsive Design! Let's create beautiful, responsive websites.",
        pricing: 89.99,
        objectives:
          "Master CSS3 fundamentals, Learn Flexbox and Grid, Implement responsive design, Create animations",
        students: [],
        curriculum: [
          {
            title: "CSS3 Fundamentals",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "css3_fundamentals_video",
            freePreview: true,
          },
          {
            title: "Flexbox Layout",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            public_id: "flexbox_layout_video",
            freePreview: false,
          },
          {
            title: "CSS Grid System",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "css_grid_video",
            freePreview: true,
          },
        ],
        isPublised: true,
      },
      {
        instructorId: "instructor202",
        instructorName: "David Brown",
        date: new Date("2024-01-19T16:30:00.000Z"),
        title: "Python for Data Science",
        category: "Data Science",
        level: "Intermediate",
        primaryLanguage: "English",
        subtitle: "Analyze data and build machine learning models with Python",
        description:
          "Comprehensive introduction to data science using Python. Learn NumPy, Pandas, Matplotlib, and basic machine learning concepts with hands-on projects.",
        image:
          "https://picsum.photos/400/300?random=5",
        welcomeMessage:
          "Welcome to Python for Data Science! Let's explore the world of data analysis and machine learning.",
        pricing: 179.99,
        objectives:
          "Master Python data analysis, Learn NumPy and Pandas, Create visualizations, Build ML models",
        students: [],
        curriculum: [
          {
            title: "Python Data Analysis Basics",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "python_basics_video",
            freePreview: true,
          },
          {
            title: "Working with NumPy and Pandas",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
            public_id: "numpy_pandas_video",
            freePreview: false,
          },
          {
            title: "Data Visualization with Matplotlib",
            videoUrl:
              "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            public_id: "matplotlib_video",
            freePreview: true,
          },
        ],
        isPublised: true,
      },
    ];

    // Insert courses into database
    const insertedCourses = await Course.insertMany(sampleCourses);
    console.log(`Successfully inserted ${insertedCourses.length} courses:`);

    insertedCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - $${course.pricing}`);
    });

    console.log("\nCourses are now available in the student view!");
    console.log(
      "Refresh your browser to see the courses in the student home page."
    );
  } catch (error) {
    console.error("Error populating courses:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  }
}

populateCourses();

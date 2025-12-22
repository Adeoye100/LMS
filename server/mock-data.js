const mockUsers = [
  {
    _id: "64f7b8e5a1b2c3d4e5f6g7h8",
    userEmail: "adeoyeopeyemi951@gmail.com",
    password: "#2007257Ad",
    role: "student",
    name: "Test User",
    theme: "light",
  },
  {
    _id: "64f7b8e5a1b2c3d4e5f6g7h9",
    userEmail: "instructor@example.com",
    password: "password123",
    role: "instructor",
    name: "Test Instructor",
    theme: "dark",
  },
];

const mockCourses = [
  {
    _id: "course1",
    title: "React Fundamentals",
    instructorName: "John Doe",
    pricing: 99.99,
    image: "https://picsum.photos/300/150?random=9",
    category: "Web Development",
  },
  {
    _id: "course2",
    title: "Node.js Backend",
    instructorName: "Jane Smith",
    pricing: 129.99,
    image: "https://picsum.photos/300/150?random=10",
    category: "Backend",
  },
];

module.exports = { mockUsers, mockCourses };

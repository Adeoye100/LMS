import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === "custom-dark") {
      document.documentElement.classList.add("dark");
      document.body.setAttribute("data-theme", "custom-dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.setAttribute("data-theme", "light");
    }
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "custom-dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
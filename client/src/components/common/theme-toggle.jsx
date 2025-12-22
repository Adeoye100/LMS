import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-9 w-9"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
# Theme Toggle Fix Plan

## Issues Identified:

1. **Empty CSS File**: The `client/src/theme.css` file is empty (0 bytes) but is being imported in `main.jsx`
2. **Wrong CSS Import**: The main.jsx imports `./theme.css` which points to the empty client file instead of the properly styled root theme.css
3. **Missing Theme Styles**: The actual theme CSS with proper variables is in `/theme.css` (root) but not being imported

## Solution Plan:

### Step 1: Fix CSS Import
- Update `client/src/main.jsx` to import the correct theme.css file from the root directory
- Change import from `./theme.css` to `../../theme.css` (since main.jsx is in client/src/)

### Step 2: Remove Empty CSS File  
- Delete the empty `client/src/theme.css` file to avoid confusion

### Step 3: Test Theme Toggle
- Start the development server
- Test the theme toggle functionality
- Verify theme switching works and styles are applied correctly

## Files to Modify:
1. `client/src/main.jsx` - Update theme.css import path
2. `client/src/theme.css` - Delete this empty file

## Expected Outcome:
- Theme toggle should work properly
- Light theme should use default styles
- Dark theme should apply custom-dark styles with proper colors
- Theme preference should persist in localStorage

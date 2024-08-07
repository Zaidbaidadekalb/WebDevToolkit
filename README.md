# WebDevToolkit: Javascript Bookmarklet for Web Development and Debugging


## Features

- Custom CSS Injector
- Element Inspector
- Network Request Monitor
- DOM Inspector
- Event Listener Monitor
- Cookie Manager
- Local Storage Manager
- JavaScript Code Editor with Execution

## Installation

1. Create a new bookmark in your browser.
2. Name it "WebDevToolkit" (or any name you prefer).
3. Copy the entire contents of the `main.js` file.
4. Paste the copied code as the URL of the bookmark, prefixed with `javascript:`.

## Usage

1. Navigate to any web page you want to inspect or modify.
2. Click on the "WebDevToolkit" bookmark to activate the toolkit.
3. The toolkit UI will appear on the right side of the page.

### CSS Injector
- Enter custom CSS in the textarea and click "Inject CSS" to apply it to the page.
- Click "Remove CSS" to revert the changes.

### Element Inspector
- Click "Start Inspector" to activate the element inspector.
- Hover over elements on the page to highlight them.
- Click on an element to see its details in the console.

### Network Request Monitor
- Click "Start Monitoring" to begin tracking network requests.
- View the captured requests in the Network Monitor panel.

### DOM Inspector
- Enter a CSS selector in the input field.
- Click "Inspect" to view details about the selected element(s).

### Event Listener Monitor
- Enter a CSS selector and event type (e.g., "click").
- Use "List Events" to see current event listeners.
- "Add Event" and "Remove Event" to manipulate listeners.

### Cookie Manager
- View all cookies with "Get All Cookies".
- Set, get, or delete individual cookies using the provided inputs and buttons.

### Local Storage Manager
- View all local storage items with "Get All Items".
- Set, get, delete individual items, or clear all local storage.

### JavaScript Code Editor
- Write and execute custom JavaScript code in the editor.
- Use the "Execute" button to run the code.
- Access custom functions like `logVersion()`, `highlightElements()`, etc.

## Keyboard Shortcuts

- Press the `Insert` key to toggle the toolkit's visibility.

## Version

Current version: 1.4.0

To check the version in the console:
```javascript
logVersion();
```
## Notes

- This toolkit is for development and testing purposes only.
- Be cautious when modifying page content or injecting CSS, as it may affect the functionality of the website.
- The changes made by the toolkit are temporary and will be reset when the page is reloaded.
- dont actually use this, this was just for fun 😭



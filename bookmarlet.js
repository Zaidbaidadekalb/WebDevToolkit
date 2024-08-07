javascript:(function() {
    console.log("Bookmarklet script started");

    // Bookmarklet version
    const BOOKMARKLET_VERSION = "1.4.0";

    // Custom functions
function logVersion() {
    const version = BOOKMARKLET_VERSION;
    console.log(`Bookmarklet version: ${version}`);
    return `Bookmarklet version: ${version}`;
}
    function highlightElements(selector, color = '#ff0') {
        const elements = document.querySelectorAll(selector);
        const highlightedElements = [];
        
        elements.forEach(el => {
            const originalBackground = el.style.backgroundColor;
            const originalOutline = el.style.outline;
            
            el.style.backgroundColor = color;
            el.style.outline = `2px solid ${color}`;
            
            highlightedElements.push({
                element: el,
                originalBackground,
                originalOutline
            });
        });
                console.log(`Highlighted ${elements.length} element(s) matching "${selector}"`);
        
        return function removeHighlight() {
            highlightedElements.forEach(({ element, originalBackground, originalOutline }) => {
                element.style.backgroundColor = originalBackground;
                element.style.outline = originalOutline;
            });
            console.log(`Removed highlighting from ${highlightedElements.length} element(s)`);
        };
    }

    function getPageMetrics() {
        const metrics = {
            title: document.title,
            url: window.location.href,
            links: document.links.length,
            images: document.images.length,
            scripts: document.scripts.length,
            loadTime: performance.now()
        };
        console.log('Page Metrics:', metrics);
        return metrics;
    }



    function injectCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        console.log('Custom CSS injected');
        return () => {
            document.head.removeChild(style);
            console.log('Custom CSS removed');
        };
    }

function inspectElement() {
        let hoveredElement = null;
        let originalOutline = '';
        
        function highlightElement(e) {
            if (hoveredElement) {
                hoveredElement.style.outline = originalOutline;
            }
            hoveredElement = e.target;
            originalOutline = hoveredElement.style.outline;
            hoveredElement.style.outline = '2px solid #f00';
        }

        function showElementInfo(e) {
            const el = e.target;
            console.log('Inspected Element:', el);
            console.log('Tag:', el.tagName);
            console.log('ID:', el.id);
            console.log('Classes:', el.className);
            console.log('Text Content:', el.textContent.trim().substring(0, 50) + '...');
        }

        document.body.addEventListener('mouseover', highlightElement);
        document.body.addEventListener('click', showElementInfo);

        return () => {
            document.body.removeEventListener('mouseover', highlightElement);
            document.body.removeEventListener('click', showElementInfo);
            if (hoveredElement) {
                hoveredElement.style.outline = originalOutline;
            }
            console.log('Element Inspector deactivated');
        };
    }

    // New function: Network Request Monitor
    function monitorNetworkRequests() {
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest.prototype.open;
        const requests = [];

        window.fetch = function(...args) {
            const request = {
                type: 'fetch',
                url: args[0],
                method: args[1]?.method || 'GET',
                timestamp: new Date().toISOString()
            };
            requests.push(request);
            console.log('Network Request:', request);
            return originalFetch.apply(this, args);
        };

        window.XMLHttpRequest.prototype.open = function(...args) {
            const request = {
                type: 'xhr',
                url: args[1],
                method: args[0],
                timestamp: new Date().toISOString()
            };
            requests.push(request);
            console.log('Network Request:', request);
            return originalXHR.apply(this, args);
        };

        return {
            getRequests: () => requests,
            stop: () => {
                window.fetch = originalFetch;
                window.XMLHttpRequest.prototype.open = originalXHR;
            }
        };
    }

    // New function: DOM Inspector
    function inspectDOM(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.error(`No element found for selector: ${selector}`);
            return;
        }

        const info = {
            tagName: element.tagName,
            id: element.id,
            classes: Array.from(element.classList),
            attributes: {},
            children: element.childElementCount,
            innerHTML: element.innerHTML.substring(0, 100) + '...'
        };

        for (let attr of element.attributes) {
            info.attributes[attr.name] = attr.value;
        }

        console.log('DOM Inspection Result:', info);
        return info;
    }

    // New function: Event Listener Monitor
    function monitorEventListeners(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.error(`No element found for selector: ${selector}`);
            return;
        }

        const listeners = getEventListeners(element);
        console.log('Event Listeners:', listeners);

        return {
            add: (eventType, callback) => {
                element.addEventListener(eventType, callback);
                console.log(`Added ${eventType} listener`);
            },
            remove: (eventType, callback) => {
                element.removeEventListener(eventType, callback);
                console.log(`Removed ${eventType} listener`);
            },
            list: () => getEventListeners(element)
        };
    }

    // New function: Cookie Manager
    const cookieManager = {
        getAll: () => {
            return document.cookie.split(';').reduce((cookies, cookie) => {
                const [name, value] = cookie.trim().split('=');
                cookies[name] = decodeURIComponent(value);
                return cookies;
            }, {});
        },
        set: (name, value, options = {}) => {
            let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
            if (options.expires) cookie += `; expires=${options.expires.toUTCString()}`;
            if (options.path) cookie += `; path=${options.path}`;
            if (options.domain) cookie += `; domain=${options.domain}`;
            if (options.secure) cookie += '; secure';
            document.cookie = cookie;
            console.log(`Cookie set: ${name}`);
        },
        get: (name) => {
            const cookies = cookieManager.getAll();
            return cookies[name];
        },
        delete: (name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
            console.log(`Cookie deleted: ${name}`);
        }
    };

    // New function: Local Storage Manager
    const localStorageManager = {
        getAll: () => {
            return { ...localStorage };
        },
        set: (key, value) => {
            localStorage.setItem(key, value);
            console.log(`Local storage item set: ${key}`);
        },
        get: (key) => {
            return localStorage.getItem(key);
        },
        delete: (key) => {
            localStorage.removeItem(key);
            console.log(`Local storage item deleted: ${key}`);
        },
        clear: () => {
            localStorage.clear();
            console.log('Local storage cleared');
        }
    };

    // Remove any existing GUI
    const existingGui = document.getElementById('advanced-bookmarklet-gui');
    if (existingGui) {
        existingGui.remove();
    }

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

        #advanced-bookmarklet-gui {
            position: fixed;
            top: 0;
            right: 0;
            width: 80vw;
            height: 100vh;
            max-width: 1200px;
            background-color: rgba(30, 30, 30, 0.95);
            color: #e0e0e0;
            font-family: 'Roboto', sans-serif;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            opacity: 0;
            transition: all 0.3s ease;
            transform: translateX(100%);
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        }

        #advanced-bookmarklet-gui.visible {
            opacity: 1;
            transform: translateX(0);
        }

        #gui-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background-color: rgba(45, 45, 45, 0.8);
            border-bottom: 1px solid #3e3e3e;
        }

        #gui-title {
            font-size: 18px;
            font-weight: 500;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        #close-gui {
            background: none;
            border: none;
            color: #e0e0e0;
            font-size: 20px;
            cursor: pointer;
            transition: text-shadow 0.3s ease;
        }

        #close-gui:hover {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }

        #gui-content {
            display: flex;
            flex-grow: 1;
            overflow: hidden;
        }

        #sidebar {
            width: 200px;
            background-color: rgba(37, 37, 38, 0.8);
            padding: 20px;
            overflow-y: auto;
        }

        .sidebar-item {
            padding: 10px;
            margin-bottom: 5px;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.2s ease;
        }

        .sidebar-item:hover, .sidebar-item.active {
            background-color: rgba(62, 62, 66, 0.8);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }

        #main-area {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        #editor-container {
            flex-grow: 1;
            overflow: hidden;
        }

        #console-container {
            height: 30%;
            display: flex;
            flex-direction: column;
            border-top: 1px solid #3e3e3e;
        }

        #console-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            background-color: rgba(45, 45, 45, 0.8);
        }

        #console-output {
            flex-grow: 1;
            overflow-y: auto;
            padding: 10px;
            font-family: 'Consolas', monospace;
            font-size: 14px;
            background-color: rgba(30, 30, 30, 0.8);
        }

        .custom-button {
            background-color: #0e639c;
            color: #ffffff;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .custom-button:hover {
            background-color: #1177bb;
            box-shadow: 0 0 10px rgba(17, 119, 187, 0.5);
        }

        #notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 4px;
            color: #fff;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        #notification.visible {
            opacity: 1;
        }

        .success { background-color: #4CAF50; }
        .error { background-color: #f44336; }

        .tool-container {
            padding: 20px;
            overflow-y: auto;
        }

        .tool-container h2 {
            margin-bottom: 15px;
        }

        .tool-container textarea {
            width: 100%;
            height: 150px;
            margin-bottom: 10px;
            background-color: rgba(30, 30, 30, 0.8);
            color: #e0e0e0;
            border: 1px solid #3e3e3e;
            border-radius: 4px;
            padding: 10px;
            font-family: 'Consolas', monospace;
        }

        .tool-container input[type="text"] {
            width: 100%;
            margin-bottom: 10px;
            background-color: rgba(30, 30, 30, 0.8);
            color: #e0e0e0;
            border: 1px solid #3e3e3e;
            border-radius: 4px;
            padding: 5px 10px;
        }

        .tool-container .button-group {
            display: flex;
            justify-content: flex-start;
            gap: 10px;
            margin-top: 10px;
        }

        .tool-container .result {
            margin-top: 15px;
            padding: 10px;
            background-color: rgba(45, 45, 45, 0.8);
            border-radius: 4px;
            white-space: pre-wrap;
        }
    `;

    const guiHTML = `
        <div id="gui-header">
            <div id="gui-title">Advanced Bookmarklet GUI</div>
            <button id="close-gui">&times;</button>
        </div>
        <div id="gui-content">
            <div id="sidebar">
                <div class="sidebar-item active" data-tab="editor">Editor</div>
                <div class="sidebar-item" data-tab="css-injector">CSS Injector</div>
                <div class="sidebar-item" data-tab="element-inspector">Element Inspector</div>
                <div class="sidebar-item" data-tab="network-monitor">Network Monitor</div>
                <div class="sidebar-item" data-tab="dom-inspector">DOM Inspector</div>
                <div class="sidebar-item" data-tab="event-monitor">Event Monitor</div>
                <div class="sidebar-item" data-tab="cookie-manager">Cookie Manager</div>
                <div class="sidebar-item" data-tab="local-storage">Local Storage</div>
                <div class="sidebar-item" data-tab="settings">Settings</div>
            </div>
            <div id="main-area">
                <div id="editor-container"></div>
                <div id="css-injector" class="tool-container" style="display: none;">
                    <h2>CSS Injector</h2>
                    <textarea id="css-textarea" placeholder="Enter your custom CSS here..."></textarea>
                    <div class="button-group">
                        <button id="inject-css" class="custom-button">Inject CSS</button>
                        <button id="remove-css" class="custom-button" style="display: none;">Remove CSS</button>
                    </div>
                </div>
                <div id="element-inspector" class="tool-container" style="display: none;">
                    <h2>Element Inspector</h2>
                    <div id="inspector-status">Element Inspector is inactive</div>
                    <button id="toggle-inspector" class="custom-button">Start Inspector</button>
                </div>
                <div id="network-monitor" class="tool-container" style="display: none;">
                    <h2>Network Request Monitor</h2>
                    <button id="start-network-monitor" class="custom-button">Start Monitoring</button>
                    <button id="stop-network-monitor" class="custom-button" style="display: none;">Stop Monitoring</button>
                    <div id="network-requests" class="result"></div>
                </div>
                <div id="dom-inspector" class="tool-container" style="display: none;">
                    <h2>DOM Inspector</h2>
                    <input type="text" id="dom-selector" placeholder="Enter CSS selector">
                    <button id="inspect-dom" class="custom-button">Inspect</button>
                    <div id="dom-result" class="result"></div>
                </div>
                <div id="event-monitor" class="tool-container" style="display: none;">
                    <h2>Event Listener Monitor</h2>
                    <input type="text" id="event-selector" placeholder="Enter CSS selector">
                    <input type="text" id="event-type" placeholder="Enter event type (e.g., click)">
                    <div class="button-group">
                        <button id="list-events" class="custom-button">List Events</button>
                        <button id="add-event" class="custom-button">Add Event</button>
                        <button id="remove-event" class="custom-button">Remove Event</button>
                    </div>
                    <div id="event-result" class="result"></div>
                </div>
                <div id="cookie-manager" class="tool-container" style="display: none;">
                    <h2>Cookie Manager</h2>
                    <input type="text" id="cookie-name" placeholder="Cookie name">
                    <input type="text" id="cookie-value" placeholder="Cookie value">
                    <div class="button-group">
                        <button id="get-all-cookies" class="custom-button">Get All Cookies</button>
                        <button id="set-cookie" class="custom-button">Set Cookie</button>
                        <button id="get-cookie" class="custom-button">Get Cookie</button>
                        <button id="delete-cookie" class="custom-button">Delete Cookie</button>
                    </div>
                    <div id="cookie-result" class="result"></div>
                </div>
                <div id="local-storage" class="tool-container" style="display: none;">
                    <h2>Local Storage Manager</h2>
                    <input type="text" id="ls-key" placeholder="Key">
                    <input type="text" id="ls-value" placeholder="Value">
                    <div class="button-group">
                        <button id="get-all-ls" class="custom-button">Get All Items</button>
                        <button id="set-ls" class="custom-button">Set Item</button>
                        <button id="get-ls" class="custom-button">Get Item</button>
                        <button id="delete-ls" class="custom-button">Delete Item</button>
                        <button id="clear-ls" class="custom-button">Clear All</button>
                    </div>
                    <div id="ls-result" class="result"></div>
                </div>
                <div id="settings-panel" class="tool-container" style="display: none;">
                    <h2>Settings</h2>
                    <div class="setting-item">
                        <input type="checkbox" id="dark-mode" checked>
                        <label for="dark-mode">Dark Mode</label>
                    </div>
                    <div class="setting-item">
                        <input type="checkbox" id="auto-execute">
                        <label for="auto-execute">Auto-Execute</label>
                    </div>
                </div>
                <div id="console-container">
                    <div id="console-header">
                        <span>Console</span>
                        <button id="clear-console" class="custom-button">Clear</button>
                    </div>
                    <div id="console-output"></div>
                </div>
            </div>
        </div>
        <div id="notification"></div>
    `;

    console.log("Creating GUI elements");

    const container = document.createElement('div');
    container.id = 'advanced-bookmarklet-gui';
    container.innerHTML = guiHTML;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;

    console.log("Appending GUI elements to document");

    document.head.appendChild(styleElement);
    document.body.appendChild(container);

    console.log("GUI elements appended");

    // GUI functionality
    const closeButton = document.getElementById('close-gui');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const editorContainer = document.getElementById('editor-container');
    const consoleOutput = document.getElementById('console-output');
    const clearConsoleButton = document.getElementById('clear-console');
    const darkModeToggle = document.getElementById('dark-mode');
    const autoExecuteToggle = document.getElementById('auto-execute');

    // CSS Injector
    const cssTextarea = document.getElementById('css-textarea');
    const injectCssButton = document.getElementById('inject-css');
    const removeCssButton = document.getElementById('remove-css');

    // Element Inspector
    const toggleInspectorButton = document.getElementById('toggle-inspector');
    const inspectorStatus = document.getElementById('inspector-status');

    // Network Monitor
    const startNetworkMonitorButton = document.getElementById('start-network-monitor');
    const stopNetworkMonitorButton = document.getElementById('stop-network-monitor');
    const networkRequestsDiv = document.getElementById('network-requests');

    // DOM Inspector
    const domSelectorInput = document.getElementById('dom-selector');
    const inspectDomButton = document.getElementById('inspect-dom');
    const domResultDiv = document.getElementById('dom-result');

    // Event Monitor
    const eventSelectorInput = document.getElementById('event-selector');
    const eventTypeInput = document.getElementById('event-type');
    const listEventsButton = document.getElementById('list-events');
    const addEventButton = document.getElementById('add-event');
    const removeEventButton = document.getElementById('remove-event');
    const eventResultDiv = document.getElementById('event-result');

    // Cookie Manager
    const cookieNameInput = document.getElementById('cookie-name');
    const cookieValueInput = document.getElementById('cookie-value');
    const getAllCookiesButton = document.getElementById('get-all-cookies');
    const setCookieButton = document.getElementById('set-cookie');
    const getCookieButton = document.getElementById('get-cookie');
    const deleteCookieButton = document.getElementById('delete-cookie');
    const cookieResultDiv = document.getElementById('cookie-result');

    // Local Storage Manager
    const lsKeyInput = document.getElementById('ls-key');
    const lsValueInput = document.getElementById('ls-value');
    const getAllLsButton = document.getElementById('get-all-ls');
    const setLsButton = document.getElementById('set-ls');
    const getLsButton = document.getElementById('get-ls');
    const deleteLsButton = document.getElementById('delete-ls');
    const clearLsButton = document.getElementById('clear-ls');
    const lsResultDiv = document.getElementById('ls-result');

    closeButton.addEventListener('click', () => {
        container.classList.remove('visible');
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const tab = item.dataset.tab;
            document.querySelectorAll('.tool-container, #editor-container').forEach(el => el.style.display = 'none');
            document.getElementById(tab === 'editor' ? 'editor-container' : tab).style.display = 'block';
        });
    });

    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = type;
        notification.classList.add('visible');
        setTimeout(() => {
            notification.classList.remove('visible');
        }, 3000);
    }

    // Console functionality
    const originalLog = console.log;
    const originalError = console.error;

    console.log = function(...args) {
        originalLog.apply(console, args);
        consoleOutput.innerHTML += `<div style="color: #4ec9b0;">> ${args.join(' ')}</div>`;
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };

    console.error = function(...args) {
        originalError.apply(console, args);
        consoleOutput.innerHTML += `<div style="color: #f48771;">> Error: ${args.join(' ')}</div>`;
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };

    clearConsoleButton.addEventListener('click', () => {
        consoleOutput.innerHTML = '';
    });

    // CSS Injector functionality
    let removeInjectedCSS = null;

    injectCssButton.addEventListener('click', () => {
        const css = cssTextarea.value;
        if (css) {
            if (removeInjectedCSS) {
                removeInjectedCSS();
            }
            removeInjectedCSS = injectCSS(css);
            injectCssButton.style.display = 'none';
            removeCssButton.style.display = 'inline-block';
            showNotification('Custom CSS injected', 'success');
        }
    });

    removeCssButton.addEventListener('click', () => {
        if (removeInjectedCSS) {
            removeInjectedCSS();
            removeInjectedCSS = null;
            injectCssButton.style.display = 'inline-block';
            removeCssButton.style.display = 'none';
            showNotification('Custom CSS removed', 'success');
        }
    });

    // Element Inspector functionality
    let stopInspector = null;

    toggleInspectorButton.addEventListener('click', () => {
        if (stopInspector) {
            stopInspector();
            stopInspector = null;
            toggleInspectorButton.textContent = 'Start Inspector';
            inspectorStatus.textContent = 'Element Inspector is inactive';
        } else {
            stopInspector = inspectElement();
            toggleInspectorButton.textContent = 'Stop Inspector';
            inspectorStatus.textContent = 'Element Inspector is active. Hover over elements and click to inspect.';
        }
    });

    // Network Monitor functionality
    let networkMonitor = null;

    startNetworkMonitorButton.addEventListener('click', () => {
        networkMonitor = monitorNetworkRequests();
        startNetworkMonitorButton.style.display = 'none';
        stopNetworkMonitorButton.style.display = 'inline-block';
        showNotification('Network monitoring started', 'success');
    });

    stopNetworkMonitorButton.addEventListener('click', () => {
        if (networkMonitor) {
            networkMonitor.stop();
            const requests = networkMonitor.getRequests();
            networkRequestsDiv.innerHTML = JSON.stringify(requests, null, 2);
            networkMonitor = null;
            startNetworkMonitorButton.style.display = 'inline-block';
            stopNetworkMonitorButton.style.display = 'none';
            showNotification('Network monitoring stopped', 'success');
        }
    });

    // DOM Inspector functionality
    inspectDomButton.addEventListener('click', () => {
        const selector = domSelectorInput.value;
        if (selector) {
            const result = inspectDOM(selector);
            domResultDiv.innerHTML = JSON.stringify(result, null, 2);
        }
    });

    // Event Monitor functionality
    listEventsButton.addEventListener('click', () => {
        const selector = eventSelectorInput.value;
        if (selector) {
            const monitor = monitorEventListeners(selector);
            eventResultDiv.innerHTML = JSON.stringify(monitor.list(), null, 2);
        }
    });

    addEventButton.addEventListener('click', () => {
        const selector = eventSelectorInput.value;
        const eventType = eventTypeInput.value;
        if (selector && eventType) {
            const monitor = monitorEventListeners(selector);
            monitor.add(eventType, () => console.log(`${eventType} event triggered`));
            eventResultDiv.innerHTML = JSON.stringify(monitor.list(), null, 2);
        }
    });

    removeEventButton.addEventListener('click', () => {
        const selector = eventSelectorInput.value;
        const eventType = eventTypeInput.value;
        if (selector && eventType) {
            const monitor = monitorEventListeners(selector);
            monitor.remove(eventType, () => {});
            eventResultDiv.innerHTML = JSON.stringify(monitor.list(), null, 2);
        }
    });

    // Cookie Manager functionality
    getAllCookiesButton.addEventListener('click', () => {
        const cookies = cookieManager.getAll();
        cookieResultDiv.innerHTML = JSON.stringify(cookies, null, 2);
    });

    setCookieButton.addEventListener('click', () => {
        const name = cookieNameInput.value;
        const value = cookieValueInput.value;
        if (name && value) {
            cookieManager.set(name, value);
            showNotification(`Cookie "${name}" set`, 'success');
        }
    });

    getCookieButton.addEventListener('click', () => {
        const name = cookieNameInput.value;
        if (name) {
            const value = cookieManager.get(name);
            cookieResultDiv.innerHTML = value ? `${name}: ${value}` : `Cookie "${name}" not found`;
        }
    });

    deleteCookieButton.addEventListener('click', () => {
        const name = cookieNameInput.value;
        if (name) {
            cookieManager.delete(name);
            showNotification(`Cookie "${name}" deleted`, 'success');
        }
    });

    // Local Storage Manager functionality
    getAllLsButton.addEventListener('click', () => {
        const items = localStorageManager.getAll();
        lsResultDiv.innerHTML = JSON.stringify(items, null, 2);
    });

    setLsButton.addEventListener('click', () => {
        const key = lsKeyInput.value;
        const value = lsValueInput.value;
        if (key && value) {
            localStorageManager.set(key, value);
            showNotification(`Local storage item "${key}" set`, 'success');
        }
    });

    getLsButton.addEventListener('click', () => {
        const key = lsKeyInput.value;
        if (key) {
            const value = localStorageManager.get(key);
            lsResultDiv.innerHTML = value ? `${key}: ${value}` : `Item "${key}" not found`;
        }
    });

    deleteLsButton.addEventListener('click', () => {
        const key = lsKeyInput.value;
        if (key) {
            localStorageManager.delete(key);
            showNotification(`Local storage item "${key}" deleted`, 'success');
        }
    });

    clearLsButton.addEventListener('click', () => {
        localStorageManager.clear();
        showNotification('Local storage cleared', 'success');
    });

    // Monaco Editor setup
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs/loader.min.js';
    script.onload = () => {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            monaco.languages.typescript.javascriptDefaults.addExtraLib(`
    /**
     * The current version of the bookmarklet.
     * This constant is read-only and cannot be modified.
     */
    declare const BOOKMARKLET_VERSION: string;

    /**
     * Logs and returns the current version of the bookmarklet.
     * @returns {string} The version of the bookmarklet.
     */
    declare function logVersion(): string;

                /**
                 * Highlights elements on the page that match the given CSS selector.
                 * @param {string} selector - The CSS selector to match elements.
                 * @param {string} [color='#ff0'] - The color to use for highlighting.
                 * @returns {Function} A function that removes the highlighting when called.
                 */
                declare function highlightElements(selector: string, color?: string): () => void;

                /**
                 * Gets various metrics about the current page.
                 * @returns {Object} An object containing page metrics.
                 */
                declare function getPageMetrics(): {
                    title: string;
                    url: string;
                    links: number;
                    images: number;
                    scripts: number;
                    loadTime: number;
                };

                /**
                 * Injects custom CSS into the page.
                 * @param {string} css - The CSS string to inject.
                 * @returns {Function} A function that removes the injected CSS when called.
                 */
                declare function injectCSS(css: string): () => void;

                /**
                 * Activates the Element Inspector.
                 * @returns {Function} A function that deactivates the Element Inspector when called.
                 */
                declare function inspectElement(): () => void;

                /**
                 * Monitors network requests made by the page.
                 * @returns {Object} An object with methods to get requests and stop monitoring.
                 */
                declare function monitorNetworkRequests(): {
                    getRequests: () => Array<{type: string, url: string, method: string, timestamp: string}>;
                    stop: () => void;
                };

                /**
                 * Inspects a DOM element based on a CSS selector.
                                  * @param {string} selector - The CSS selector to match the element.
                 * @returns {Object} An object containing information about the element.
                 */
                declare function inspectDOM(selector: string): {
                    tagName: string;
                    id: string;
                    classes: string[];
                    attributes: {[key: string]: string};
                    children: number;
                    innerHTML: string;
                };

                /**
                 * Monitors event listeners on a specific element.
                 * @param {string} selector - The CSS selector to match the element.
                 * @returns {Object} An object with methods to add, remove, and list event listeners.
                 */
                declare function monitorEventListeners(selector: string): {
                    add: (eventType: string, callback: Function) => void;
                    remove: (eventType: string, callback: Function) => void;
                    list: () => {[key: string]: Function[]};
                };

                /**
                 * Manages cookies for the current page.
                 */
                declare const cookieManager: {
                    getAll: () => {[key: string]: string};
                    set: (name: string, value: string, options?: {expires?: Date, path?: string, domain?: string, secure?: boolean}) => void;
                    get: (name: string) => string | undefined;
                    delete: (name: string) => void;
                };

                /**
                 * Manages local storage for the current page.
                 */
                declare const localStorageManager: {
                    getAll: () => {[key: string]: string};
                    set: (key: string, value: string) => void;
                    get: (key: string) => string | null;
                    delete: (key: string) => void;
                    clear: () => void;
                };
            `, 'bookmarklet-types.d.ts');

            window.editor = monaco.editor.create(editorContainer, {
                value: '// Welcome to the Advanced Bookmarklet GUI!\n// Start coding here...\n// Try calling logVersion(), highlightElements(), getPageMetrics(), injectCSS(), inspectElement(), monitorNetworkRequests(), inspectDOM(), monitorEventListeners(), or use cookieManager and localStorageManager',
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true
            });

            // Auto-execute feature
            autoExecuteToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    window.editor.onDidChangeModelContent(() => {
                        executeCode();
                    });
                } else {
                    window.editor.onDidChangeModelContent(() => {});
                }
            });

            // Dark Mode feature
            darkModeToggle.addEventListener('change', (e) => {
                monaco.editor.setTheme(e.target.checked ? 'vs-dark' : 'vs');
            });

            // Execute code function
            function executeCode() {
                const code = window.editor.getValue();
                try {
                    console.log("Executing code:");
                    console.log(code);
                    const startTime = performance.now();
                    const result = eval(`
                        const BOOKMARKLET_VERSION = "${BOOKMARKLET_VERSION}";
    Object.defineProperty(window, 'BOOKMARKLET_VERSION', {
        value: BOOKMARKLET_VERSION,
        writable: false,
        configurable: false
    });
                        const logVersion = ${logVersion.toString()};
                        const highlightElements = ${highlightElements.toString()};
                        const getPageMetrics = ${getPageMetrics.toString()};
                        const injectCSS = ${injectCSS.toString()};
                        const inspectElement = ${inspectElement.toString()};
                        const monitorNetworkRequests = ${monitorNetworkRequests.toString()};
                        const inspectDOM = ${inspectDOM.toString()};
                        const monitorEventListeners = ${monitorEventListeners.toString()};
                        const cookieManager = ${JSON.stringify(cookieManager)};
                        const localStorageManager = ${JSON.stringify(localStorageManager)};
                        ${code}
                    `);
                    const endTime = performance.now();
                    const executionTime = endTime - startTime;
                    if (result !== undefined) {
                        console.log("Result:", result);
                    }
                    console.log(`Execution time: ${executionTime.toFixed(2)}ms`);
                } catch (error) {
                    console.error("Error:", error.message);
                }
            }

            // Add execute button
            const executeButton = document.createElement('button');
            executeButton.textContent = 'Execute';
            executeButton.className = 'custom-button';
            executeButton.style.position = 'absolute';
            executeButton.style.bottom = '10px';
            executeButton.style.right = '10px';
            executeButton.addEventListener('click', executeCode);
            editorContainer.appendChild(executeButton);

            console.log("Monaco Editor initialized");
            console.log("Welcome to the Advanced Bookmarklet GUI!");
            console.log("Try using the various tools and functions available in the sidebar.");
        });
    };
    document.body.appendChild(script);

    // Show GUI with smooth animation
    setTimeout(() => {
        container.classList.add('visible');
    }, 100);

    // Toggle GUI visibility with INSERT key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Insert') {
            console.log("Toggle GUI visibility");
            container.classList.toggle('visible');
        }
    });

    console.log("Bookmarklet script completed");
})();

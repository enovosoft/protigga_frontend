import { useEffect } from "react";

export default function DevToolsProtection() {
  useEffect(() => {
    // Check access once on mount
    const checkAccess = () => {
      try {
        // Using obfuscation to hide the key/value
        const k = atob("cm9sZQ==");
        const v = atob("c3Vkbw==");
        const stored = localStorage.getItem(k);

        // XOR encryption check for additional security
        const hash = (str) => {
          let h = 0;
          for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h + str.charCodeAt(i)) | 0;
          }
          return h.toString(36);
        };

        // Check if the hashed value matches
        const expectedHash = hash(v);
        const storedHash = stored ? hash(stored) : null;

        return storedHash === expectedHash;
      } catch {
        return false;
      }
    };

    // Read the access value once
    const hasAccess = checkAccess();

    // Anti-DevTools protection - runs every 400ms
    const debuggerInterval = setInterval(() => {
      if (!hasAccess) {
        // eslint-disable-next-line no-debugger
        debugger;
      }
    }, 400);

    // Prevent keyboard shortcuts for DevTools
    const blockDevToolsShortcuts = (e) => {
      if (hasAccess) return; // Allow developer

      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C", "K"].includes(e.key)) ||
        (e.metaKey && e.altKey && e.key === "I")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Prevent right-click context menu (except for developer users)
    const blockRightClick = (e) => {
      if (hasAccess) return; // Allow developer users
      e.preventDefault();
      return false;
    };

    // Additional protection: Detect DevTools size changes
    const detectDevTools = () => {
      if (hasAccess) return; // Allow developer users

      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        // DevTools is likely open - clear the page
        document.body.innerHTML =
          "<h1 style='text-align:center; margin-top:50px; font-family: system-ui;'>Access Denied</h1><p style='text-align:center; color: #666;'>Developer tools are not allowed. Please disable extensions or contact developer team</p>";
      }
    };

    // Apply protections
    document.addEventListener("keydown", blockDevToolsShortcuts);
    document.addEventListener("contextmenu", blockRightClick);

    // Check for DevTools every 1 second
    const detectInterval = setInterval(detectDevTools, 1000);

    // Cleanup
    return () => {
      clearInterval(debuggerInterval);
      clearInterval(detectInterval);
      document.removeEventListener("keydown", blockDevToolsShortcuts);
      document.removeEventListener("contextmenu", blockRightClick);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

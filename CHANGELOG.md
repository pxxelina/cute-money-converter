# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-03-08

### Added
-   **Modular Architecture**: Separated `index.html` into `styles.css` (styling), `data.js` (currency data), and `scripts.js` (application logic) for better maintainability.
-   **Copy to Clipboard**: Added a "Copy" button to the conversion result for a better user experience.
-   **Input Validation**: Added visual feedback (shake animation and red border) for invalid numeric inputs.
-   **Auto-update results**: The conversion result now updates automatically as the user types (if a result was already calculated).

### Improved
-   **Performance**: Optimized currency selector population using `DocumentFragment` to minimize DOM reflows.
-   **Error Handling**: Enhanced API error handling with a cleaner asynchronous structure and clearer status messages for offline/fallback modes.
-   **UI/UX**: Refactored the layout for better responsiveness and added subtle micro-animations for feedback transitions.
-   **Code Quality**: Moved from inline event handlers to modern `addEventListener` and cleaned up global scope by using `DOMContentLoaded`.

### Changed
-   `index.html`: Now serves as a clean entry point with external asset links.
-   Currency Data: Moved to a dedicated `data.js` file for easier updates.

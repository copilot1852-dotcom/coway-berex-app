# PWA Install Guide Design

## Goal

Show a small in-app install guide for the deployed PWA so users who open the KakaoTalk link in a browser can find the app install path again.

## Approach

Add a standalone DOM banner to `deploy/index.html` outside the React app. It listens for `beforeinstallprompt`, stores the event, and uses a user-tapped install button to call the browser's native PWA prompt when available.

When the native event is unavailable, the banner shows manual install instructions for Chrome/Android or Safari/iOS. The banner hides in standalone mode and after `appinstalled`. The close button only suppresses it for the current browser session.

## Testing

Add `scripts/verify_pwa_install_prompt.js` to statically verify the required install guide DOM, event listeners, and copy exist in `deploy/index.html`.

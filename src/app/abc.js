// {
//   "manifest_version": 3,
//   "name": "CRM Idle Monitor",
//   "version": "1.9",
//   "description": "Monitors System Idle State for CRM Employees",
//   "permissions": ["idle", "storage","tabs"],
//   "host_permissions": [
//     "http://localhost:8000/*",
//     "https://api.pentaprime-innovations.com/*" 
//   ],
//   "externally_connectable": {
//     "matches": ["http://localhost:3000/*", "https://zytronworld.online/*"]
//   },
//   "background": {
//     "service_worker": "background.js"
//   },
//   "content_scripts": [
//     {
//       "matches": ["http://localhost:3000/*","https://zytronworld.online/*"],
//       "js": ["content.js"],
//       "run_at": "document_start"
//     }
//   ]
// }
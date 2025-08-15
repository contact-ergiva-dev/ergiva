self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/about": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/about.js"
    ],
    "/admin": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin.js"
    ],
    "/admin/dashboard": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/dashboard.js"
    ],
    "/admin/orders": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/orders.js"
    ],
    "/admin/products": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/products.js"
    ],
    "/admin/sessions": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/sessions.js"
    ],
    "/admin/testimonials": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin/testimonials.js"
    ],
    "/book-session": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/book-session.js"
    ],
    "/join-partner": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/join-partner.js"
    ],
    "/shop": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/shop.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];
module.exports = [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "https:"],
          "connect-src": ["'self'", "https:", "blob:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "res.cloudinary.com",
            "i.ytimg.com",
            "img.youtube.com",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "res.cloudinary.com",
            "youtube.com",
            "www.youtube.com",
          ],
          "frame-src": [
            "'self'",
            "youtube.com",
            "www.youtube.com",
            "youtu.be",
            "https://www.youtube-nocookie.com",
          ],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
          ],
          "font-src": ["'self'"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];

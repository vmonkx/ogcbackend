module.exports = ({ env }) => ({
  upload: {
    provider: "cloudinary",
    providerOptions: {
      cloud_name: env("CLOUDINARY_NAME"),
      api_key: env("CLOUDINARY_KEY"),
      api_secret: env("CLOUDINARY_SECRET"),
    },
    actionOptions: {
      upload: {},
      delete: {},
    },
  },

  email: {
    provider: "nodemailer",
    providerOptions: {
      service: "Gmail",
      /* auth: {
        type: "OAuth2",
        user: env("SMTP_USERNAME"),
        accessToken: env("SMTP_TOKEN"),
      }, */
      auth: {
        type: "OAuth2",

        clientId: env("MAIL_CLIENT_TOKEN"),
        clientSecret: env("MAIL_SECRET_TOKEN"),
        refreshToken: env("MAIL_REFRESH_TOKEN"),
        user: "administrator@gorchakova-clinic.ru",
        accessUrl: "https://oauth2.googleapis.com/token",
        accessToken:
          "ya29.A0AfH6SMDOHLdOxT3hSZcfgG5qBHM5bEaAis53XxZVLAGd_fSvS1a8LAA-eXbtNKdVyI8Z0djk1cUjr0CQKQPTf4FePvA1flCbmarnUZJWE38FPUTjhmgAYkgEcgTre97ppFK618xID2PxT4C9-zTYHXOH-OOs",
      },

      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: "administrator@gorchakova-clinic.ru",
    },
  },
});

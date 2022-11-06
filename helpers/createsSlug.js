const slugify = require("slugify");

function SendEmail() {
  await strapi.plugins['email'].services.email.send({
    to: 'someone@example.com',
    from: 'someone2@example.com',
    subject: 'Hello world',
    text: 'Hello world',
    html: `<h4>Hello world</h4>`,
  });
}

"use strict";
const { parseMultipartData } = require("strapi-utils");
const MessageToTelegram = require("../../../helpers/sendTelegram");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.order.create(data, { files });
    } else {
      /* await strapi.plugins["email"].services.email
        .send({
          to: "admin@gorchakova-clinic.ru",
          from: "administrator@gorchakova-clinic.ru",
          subject: "Hello world",
          text: "Hello world",
          html: `<h4>Hello world</h4>`,
        })
        .then((res) => console.log("RES", res))
        .catch((err) => console.log("ERROR", err)); */
      const order = ctx.request.body;

      
      const res = ctx.response;
      if (order) {
        MessageToTelegram.sendMsg(order);
        res.status = 200;
        res.body = "Заявка успешно отправлена!";
      } else {
        res.status = 400;
        res.body = "Произошла ошибка! Попробуйте еще раз";
      }
      return res;
    }
  },
};

"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const MessageToTelegram = require("../../../helpers/sendTelegram");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    // some logic here
    const response = await super.create(ctx);
    // some more logic

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.order.create(data, { files });
    } else {
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

    return response;
  },
}));

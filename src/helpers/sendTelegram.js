const axios = require("axios").default;
require('dotenv').config();

const DICT = {
  firstName: "Имя",
  phone: "Телефон",
  comment: "Комментарий",
};

module.exports.sendMsg = async (req) => {
  let fieldsOrder = ["⭐️ Новая заявка с сайта"];
  if (req) {
    const message = req.data;

    for (const key in message) {
      if (Object.hasOwnProperty.call(message, key)) {
        fieldsOrder.push(`<b>${DICT[key]}</b>: ${message[key]}`);
      }
    }
  }

  let msg = "";

  fieldsOrder.forEach((field) => {
    msg += field + "\n";
  });

  msg = encodeURI(msg);

  const api = process.env.TELEGRAM_API;

  await axios
    .post(`${api}${msg}`)
    .then((response) => {
      console.log("statusCode:", response.status);
    })
    .catch((error) => {
      console.log("error:", error);
    });
};

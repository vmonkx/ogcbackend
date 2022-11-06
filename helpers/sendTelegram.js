const axios = require("axios").default;

const DICT = {
  firstName: "Имя",
  phone: "Телефон",
  comment: "Комментарий",
};

module.exports.sendMsg = async (message) => {
  console.log("AXIOS", message);
  let fieldsOrder = ["⭐️ Новая заявка с сайта"];
  if (message) {
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

  await axios
    .post(
      `https://api.telegram.org/bot1679995883:AAHS05az-5GfGEQYAEWV5EM5OidjGwEQXPE/sendMessage?chat_id=-584672924&parse_mode=html&text=${msg}`
    )
    .then((response) => {
      console.log("statusCode:", response.status);
    })
    .catch((error) => {
      console.log("error:", error);
    });
};

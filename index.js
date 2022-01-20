const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.yandex.ru",
  auth: {
    user: "info@экостроинвест.рф",
    pass: process.env.TRANSPORTER_AUTH_PASSWORD,
  },
  secure: true,
});

app.post("/email", (req, res) => {
  const { subject, name, phone, dateTime } = req.body;
  if (!subject || !name || !phone) {
    res.status(400).send({ message: `Сервер не может обработать этот запрос` });
  }

  const parseDate = (dateISO) => {
    const date = new Date(dateISO);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day <= 9 ? "0" + day : day}.${
      month <= 9 ? "0" + month : month
    }.${year} ${hours}:${minutes}:${seconds}`;
  };

  const mailData = {
    from: "info@экостроинвест.рф",
    to: "info@экостроинвест.рф",
    subject: "ЭкоСтройИнвест",
    html: `
        <div><b>Тема: </b> ${subject}</div>
        <div><b>Имя: </b> ${name}</div>
        <div><b>Телефон: </b> ${phone}<div />
        <div><b>Дата и время: </b> ${
          dateTime ? parseDate(dateTime) : "не указано"
        }</div>
    `,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Ну удалось отправить сообщение" });
    } else {
      res.status(200).send({ message: "Mail send", messageId: info.messageId });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

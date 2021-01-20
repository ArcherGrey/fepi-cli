#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");

// 配置文件
const path = `${__dirname}/../common.config.json`;
const config = require(path);

const lang = config.lang;

const msg = {
  en: {
    langSelect: "Please Select a language:",
    err: `[${chalk.green("config item")}]`,
    success: "change config successfully!\n"
  },
  zh: {
    langSelect: "请选择一种语言：",
    err: `[${chalk.green("配置项")}]`,
    success: "修改配置项成功!\n"
  }
};
program.name("fepe set").usage(msg[lang].err);
program.parse(process.argv);

const exec = item => {
  let questions = [
    {
      name: "lang",
      type: "list",
      message: msg[lang].langSelect,
      choices: ["中文", "English"],
      filter: function (val) {
        switch (val) {
          case "中文":
            return "zh";
          case "English":
            return "en";
        }
      }
    }
  ];
  // 不输入配置项就配置所有
  if (!item || item.length == 0) {
    return inquirer.prompt(questions).then(answers => {
      fs.writeFile(path, JSON.stringify(answers), "utf-8", err => {
        if (err) console.log(err);
        console.log("\n");
        console.log(chalk.green(msg[lang].success));
      });
    });
  }
  switch (item.length) {
    case 1:
      questions = questions.filter(q => {
        return q.name == item;
      });
      return inquirer.prompt(questions).then(answers => {
        console.log(answers);
      });

    default:
      program.help();
  }
};
exec(program.args);

import dotenv from "dotenv"
dotenv.config()

import TelegramBot from "node-telegram-bot-api"
import keyboard from './helpers/keyboards/keyboards.js'
import { read } from "./utils/FS.js"
import { geo } from "./utils/geoFinder.js"
import path from "path"

const bot = new TelegramBot(process.env.TOKEN, {polling: true})

bot.onText(/\/start/, msg => {
    console.log(msg);
    const chatId = msg.chat.id
    bot.sendMessage(chatId, `${msg.from.first_name} welcome to my porfolio`,{
        reply_markup: {
        keyboard:keyboard.menu,
        resize_keyboard: true
        }
    })
})

bot.on("message", msg => {
    const chatId = msg.chat.id

    if (msg.text == "Back to menu 🔙") {
        bot.sendMessage(chatId, "Menu", {
            reply_markup:{
                keyboard: keyboard.menu,
                resize_keyboard: true
            }
        })
    }

    if (msg.text == "My projects 🏢") {
    const allProjects = read('projects.json')
        bot.sendMessage(chatId, "There are my projecs", {
            reply_markup: {
                keyboard: keyboard.projects,
                resize_keyboard: true 
            }
        })
    }
})

bot.on("message", msg => {
    const chatId = msg.chat.id
    const allProjects = read('projects.json')
    const foundProjects = allProjects.find(e => e.name == msg.text)
    if (foundProjects) {
        bot.sendPhoto(chatId, `${foundProjects.img}`,{
            caption:`<b>
            ${foundProjects.isUsed}
            </b>
            <i>
            \n${foundProjects.description}
            </i>
            `,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Link',
                            callback_data: 'link',
                            url: `${foundProjects.url}`
                        },
                        {
                            text: 'Register',
                            callback_data: `${foundProjects.id}`
                        }
                    ]
                ],
                resize_keyboard: true
            }
        })
    }
})

bot.on('callback_query', msg => {

    const chatId = msg.message.chat.id
    console.log(msg.data);
    const foundProject = read('projects.json').find(e => e.id == msg.data)
    console.log(foundProject);

    if (foundProject) {
        bot.sendMessage(chatId, "Send your location", {
            reply_markup: JSON.stringify({
                keyboard: [
                    [
                        {
                            text: "Send your location",
                            request_location: true
                        }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            })
        })
    }
})

bot.on("location", async msg => {

    const { latitude, longitude }= msg.location

    const userLocation = await geo(latitude, longitude )
    console.log(userLocation);

    bot.sendMessage(msg.chat.id, `Is this ${userLocation} location`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Yes",
                        callback_data: "yes",
                    },
                    {
                        text: "No",
                        callback_data: "no",
                    }
                ]
            ],
            one_time_keyboard: true
        }
    })
})

bot.on('callback_query', msg => {
    const chatId = msg.message.chat.id

    if (msg.data == "yes") {
        bot.sendMessage(chatId, 'share your contact' , {
            reply_markup: JSON.stringify({
                keyboard: [
                    [
                        {
                            text: "Share your number",
                            request_contact: true
                        },
                        {
                            text: "Back to menu",

                        }

                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            })
        })
    }

    if (msg.data == "no") {
        bot.sendMessage(chatId, "Back to menu", {
            reply_markup: {
                keyboard: keyboard.menu,
                resize_keyboard: true
            }
        })
    }

})

bot.on('message', msg => {
    if (msg.text == "Back to menu") {
        bot.sendMessage(msg.chat.id, "Menu", {
            reply_markup: {
                keyboard: keyboard.menu,
                resize_keyboard: true
            }
        })
    }
})
bot.on('message', msg => {
    if (msg.text == 'My resume 💁🏼‍♂️') {
      bot.sendDocument(msg.chat.id, path.join(process.cwd(), "rezume.pdf",))  
    }
})

bot.on("message", msg => {
    if (msg.text == "My knowledge 💻") {
        bot.sendPhoto(msg.chat.id, "https://image.shutterstock.com/shutterstock/photos/1757407325/display_1500/stock-vector-vector-collection-of-web-development-shield-signs-html-css-javascript-react-js-angular-vue-1757407325.jpg")
    }
})
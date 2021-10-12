const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const exphbs = require('express-handlebars')
const telegramApi = require('node-telegram-bot-api')
const todoRoutes = require('./routes/todos')
const ChatIdDB = require('./models/Chat_user')
//для чата
const {gameOptions, againOptions} = require('./options')

const PORT = process.env.PORT || 3000

//для чата бота! Вам нужно добавить токкен
const token = ''
const bot = new telegramApi(token,{polling: true})
const chats = {}

//конец
const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true })) //Важно это что бы обрабатывать body и данные из форм!
app.use(express.static(path.join(__dirname, 'public')))

app.use(todoRoutes)

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

async function start() {
    try {
        await mongoose.connect(
            //Вам нужно вписать токен для Монго БД
            '',
            {
                useNewUrlParser: true,
                //useFindAndModify: false
            }
        )
        app.listen(PORT, () => {
            console.log('Сервер уже запущен')
        })
    } catch (e) {
        console.log(e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Запуск'},
        {command: '/info', description: 'О Вас'},
        {command: '/game', description: 'Попробуй обыграй меня!'},
    ])

    bot.on('message', async msg=>{
        const text = msg.text
        const chatId = msg.chat.id;
        try{
            if(text === '/start'){
                const chat = new ChatIdDB({
                    chatID: chatId,
                    title: msg.from.username,
                })
                await chat.save()
                await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/1.webp`)
                return bot.sendMessage(chatId, `Добро пожаловать!`)
            }
            if(text === '/info'){
                const ChatIdDBs = await ChatIdDB.find({chatID: chatId}).lean() //обращаемся в бд async! асинхронность await - ждем пока вернется запрос
                console.log(ChatIdDBs)
                return bot.sendMessage(chatId, `Вы ${msg.from.username}, в игре у тебя правильных ответо - ${ChatIdDBs[0].right}, неправильных - ${ChatIdDBs[0].wrong}`)
            }
            if(text === '/game'){
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, `Я Вас не понимаю!`)
        }catch (e){
            return bot.sendMessage(chatId, `Ошибка`)
        }
    })

    bot.on('callback_query', async msg=>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId);
        }
        const ChatIdDBs = await ChatIdDB.findOne({chatID: chatId})//обращаемся в бд async! асинхронность await - ждем пока вернется запрос
        if(data == chats[chatId]){
            ChatIdDBs.right = parseInt(ChatIdDBs.right) + 1
            await bot.sendMessage(chatId, `Вы угадали ${data}`, againOptions)
        }
        else{
            //ChatIdDBs[0].wrong += 1
            ChatIdDBs.wrong = parseInt(ChatIdDBs.wrong) + 1
            await bot.sendMessage(chatId, `Вы НЕ угадали, я загадал ${chats[chatId]}`, againOptions)
        }
        await ChatIdDBs.save()
    })

}

start()

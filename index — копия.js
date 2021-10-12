const express = require('express') //это подключили экспресс
const mongoose = require('mongoose')
const exphds = require('express-handlebars')
const todoRoutes = require('./routes/todos')

const PORT = process.env.PORT || 3000 //это устоновили порт по умолчанию process это большой объект можно посмотреть console.log(process)

//console.log(process)
const app = express()//приложение создалось
// позволяет настраивать конфигурации для шаблона
const hbs = exphds.create({
    defaultLayout: 'main', //указываем дэфолтный лояут
    extname: 'hbs'//по умолчанию расширение!
})

//передаем в движок для рендеренга страницы
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(todoRoutes)
app.use(express.urlencoded({extended: true}))

console.log(111111)

async function start(){ //это асинхронная функция
    try
    {
        //подключение к базе
        await mongoose.connect('mongodb+srv://vladislav:qwertyV@cluster0.cfhp3.mongodb.net/todos',{
            useNewUrlParser: true,
            useFindAndModify: false
        })
        //запуск сервера
        app.listen(PORT, ()=>{
            console.log('Сервер уже запущен')
        })
    }catch (e){
        console.log(e)//это если ошибка случилась выводим её в консоль
    }
}
start()

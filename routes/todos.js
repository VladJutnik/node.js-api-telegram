const {Router} = require('express')
const Todo = require('../models/Todo')
const News = require('../models/News')
const ChatIdDB = require('../models/Chat_user')
const router = Router()

router.get('/', async (req, res) => {
    const todos = await Todo.find({}).lean() //обращаемся в бд async! асинхронность await - ждем пока вернется запрос
    const news = await News.find({}).lean() //обращаемся в бд async! асинхронность await - ждем пока вернется запрос
    //console.log(todos)
    res.render('index',{
        title: 'Главная страница',
        isIndex: true,
        todos, // передаем все данные из БД которые получили
        news // передаем все данные из БД которые получили
    })
})
router.get('/create', (req, res) => {
    res.render('create', {
        title: 'Страница добавления',
        isCreate: true
    })
})
router.get('/create-text', (req, res) => {
    res.render('create-text', {
        title: 'Страница добавления новостей',
        isCreateText: true
    })
})
//Это для метода обработки страницы добавления списка
router.post('/create-text', async (req, res) => {
   const news = new News({
       title: req.body.title,
       description: req.body.description,
       date: req.body.date,
   })
    await news.save() //await Жду пока сохраниться!
    res.redirect('/')
})
//Это для метода обработки страницы добавления списка
router.post('/create', async (req, res) => {
   const todo = new Todo({
       title: req.body.title
   })
    await todo.save() //await Жду пока сохраниться!
    res.redirect('/')
})

router.post('/complete', async (req, res)=>{
    const todo = await Todo.findById(req.body.id)
    todo.completed = !!req.body.completed //двойное отрициние для возвращения булеан!
    await todo.save()
    res.redirect('/')
})
/*router.get('/info-bot', (req, res) => {
    const botInfo = await ChatIdDB.find({}).lean() //обращаемся в бд async! асинхронность await - ждем пока вернется запрос
    //console.log(todos)
    res.render('info-bot',{
        title: 'Список пользователей чат бота',
        isInfoBot: true,
        botInfo, // передаем все данные из БД которые получили
    })
})*/
router.get('/info-bot', async (req, res) => {
    const botInfo = await ChatIdDB.find({}).lean() //обращаемся в бд async! асинхронность await - ждем пока вернется запрос
    res.render('info-bot', {
        title: 'Страница добавления',
        isInfoBot: true,
        botInfo: botInfo
    })
})
module.exports = router


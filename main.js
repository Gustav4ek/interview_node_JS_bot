require('dotenv').config();
const { Bot, Keyboard, GrammyError, HttpError, InlineKeyboard} = require("grammy");
const {getRandomQuestion, getCorrectAnswer} = require("./utils");

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", async(ctx) => {
    const startKeyboard = new Keyboard().text('JavaScript').text('NodeJS').text('Случайный вопрос').resized()
    await ctx.reply('Выбери тему', {
        reply_markup: startKeyboard
    })
});

bot.hears(['JavaScript', 'NodeJS', 'Случайный вопрос'], async (ctx) => {
    const topic = ctx.message.text.toLowerCase()

    const {question, questionTopic} =  getRandomQuestion(topic)
    const inlineKeyboard = new InlineKeyboard()
        .text('Узнать ответ', JSON.stringify({
            type: questionTopic,
            questionId: question.id
        })
        )

    await ctx.reply(question.text, {
        reply_markup: inlineKeyboard
    })
})

bot.on('callback_query:data', async (ctx) => {

    const callBackData = JSON.parse(ctx.callbackQuery.data)
    const answer = getCorrectAnswer(callBackData.type, callBackData.questionId)
    await ctx.reply(answer, {
        parse_mode: 'HTML',
        disable_web_page_preview: true
    })
    await ctx.answerCallbackQuery()
    return
})

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

bot.start();


const { Random } = require('random-js')
const questions = require('./questions.json')

const getRandomQuestion = (topic) => {
    const random = new Random()

    let questionTopic = topic.toLowerCase()

    if (questionTopic === 'Случайный вопрос') {
        questionTopic = Object.keys(questions)[random.integer(0, Object.keys(questions).length-1)]
    }

    const randomQuestionIndex = random.integer(0, questions[questionTopic].length-1 )

    return {
        question: questions[questionTopic][randomQuestionIndex],
        questionTopic,
    }
}

const getCorrectAnswer = (topic, questionId) => {
    const question = questions[topic].find((question) => question.id === questionId)
    return question.answer
}

module.exports = {getRandomQuestion, getCorrectAnswer}
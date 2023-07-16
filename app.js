const axios = require('axios');

/**
* Sending a message to Telegram.
* @param username - the user's name. The user must already have a dialog with the bot.
* @param text - the text of the message.
* @throws - error if there is no chat.
*/

async function sendTelegramMessage(username, text) {
    const token = 'Bot_Token'; // Telegram Bot token

    try {
        const response = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`);

        if (!response.data.ok) {
            throw new Error(response.data.description);
        }

        const chat = response.data.result.find((update) => update.message?.from?.username === username)?.message?.chat;

        if (!chat) {
            throw new Error(`Couldn't find a chat with a user ${username}.`);
        }

        const message = {
            chat_id: String(chat.id),
            text: `${text.replace(/[.!]/g, '\\$&')}`,
            parse_mode: 'MarkdownV2',
        };

        const sendMessageResponse = await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, message);

        if (!sendMessageResponse.data.ok) {
            throw new Error(sendMessageResponse.data.description);
        }

        console.log('Success!');
    } catch (error) {
        console.error('Error:', error);
    }
}

const username = 'user'; // username
const message = 'Hello world!'; // message

sendTelegramMessage(username, message);

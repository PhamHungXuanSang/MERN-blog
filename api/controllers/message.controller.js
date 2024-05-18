import { io, userOnline } from '../index.js';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });

        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId] });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        const socketId = userOnline.get(receiverId.toString());
        if (socketId) {
            io.to(socketId).emit('newMessage', newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const { userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate('messages');

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const gemini = async (req, res, next) => {
    try {
        async function run() {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const chat = model.startChat({
                history: req.body.history,
            });
            const result = await chat.sendMessage(req.body.message);
            const response = await result.response;
            res.json(response.text());
        }

        run();
    } catch (error) {
        next(error);
    }
};

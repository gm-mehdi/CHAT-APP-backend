"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = exports.sendMessage = void 0;
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        console.log("message sent", req.params.id);
        let conversation = yield conversation_model_1.default.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = yield conversation_model_1.default.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = new message_model_1.default({
            senderId,
            receiverId,
            message,
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        // TODO: SOCKET IO FUNCTIONNALITY WILL BE HERE
        //save the conversation and the messages in database
        // await conversation.save();
        // await newMessage.save();
        //this will run in parallel
        yield Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json({ message: newMessage });
    }
    catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: `${error.message}` });
    }
});
exports.sendMessage = sendMessage;
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: usertoChatwithId } = req.params;
        const senderId = req.user._id;
        const conversation = yield conversation_model_1.default.findOne({
            participants: { $all: [senderId, usertoChatwithId] },
        }).populate("messages");
        if (!conversation)
            return res.status(200).json([]);
        const messages = conversation.messages;
        res.status(200).json(conversation === null || conversation === void 0 ? void 0 : conversation.messages);
    }
    catch (error) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({ error: `${error.message}` });
    }
});
exports.getMessage = getMessage;

import { Request, Response } from 'express';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import { getReceiverSocketId, io } from '../socket/socket';
export const sendMessage = async (req: any, res: Response) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        console.log("message sent", req.params.id);


        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }



        //this will run in parallel
        await Promise.all([conversation.save(),newMessage.save()]);
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}


        res.status(201).json({ message: newMessage })
    } catch (error: any) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: `${error.message}` })
    }

}

export const getMessage = async (req: any, res: any) => {
    try {
        const {id: usertoChatwithId} = req.params
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, usertoChatwithId] },
        }).populate("messages");

        if(!conversation) return res.status(200).json([])

        const messages = conversation.messages;
        

        res.status(200).json(conversation?.messages)
    } catch (error: any) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({ error: `${error.message}` })
    }
}
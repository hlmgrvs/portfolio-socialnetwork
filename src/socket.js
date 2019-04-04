import {
    addUserId,
    listOnlineUsers,
    addToOnlineusersList,
    removeFromOnlineUsersList,
    receiveMessage,
    addMessage
} from "./actions";
import * as io from "socket.io-client";

let socket;

export function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("userId", id => {
            store.dispatch(addUserId(id));
        });

        socket.on("onlineUsers", users => {
            store.dispatch(listOnlineUsers(users));
        });

        socket.on("userJoined", user => {
            store.dispatch(addToOnlineusersList(user));
        });

        socket.on("userLeft", user => {
            store.dispatch(removeFromOnlineUsersList(user));
        });

        socket.on("chatMessages", messages => {
            console.log(messages);
            store.dispatch(receiveMessage(messages));
        });

        socket.on("addMessage", newMessage => {
            console.log(newMessage);
            store.dispatch(addMessage(newMessage));
        });
    }
    return socket;
}

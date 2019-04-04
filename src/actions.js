import axios from "./axios";

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get("/friends-and-wannabes");
    // console.log("data: ", data);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        list: data
    };
}

export function confirmFriend(wannabe_id) {
    console.log("wannabe_id: ", wannabe_id);
    return axios
        .post("/updatefriend/" + wannabe_id, { action: "Accept new friend" })
        .then(() => {
            return {
                type: "ACCEPT",
                id: wannabe_id
            };
        })
        .catch(err => {
            console.log("error @ accept: ", err);
        });
}

export function unfriend(friend_id) {
    console.log("friend_id: ", friend_id);

    return axios
        .post("/updatefriend/" + friend_id, { action: "Unfriend" })
        .then(() => {
            return {
                type: "UNFRIEND",
                id: friend_id
            };
        })
        .catch(err => {
            console.log("error @ unfriend: ", err);
        });
}

export function addUserId(id) {
    console.log(" addUserId(id): ", id);
    return {
        type: "ADD_USER_ID",
        userId: id
    };
}

export function listOnlineUsers(users) {
    console.log(" listOnlineUsers(users): ", users);
    return {
        type: "LIST_ONLINE_USERS",
        users: users
    };
}

export function addToOnlineusersList(user) {
    return {
        type: "ADD_ONLINE_USERS_LIST",
        user: user
    };
}

export function removeFromOnlineUsersList(id) {
    return {
        type: "REMOVE_ONLINE_USERS_LIST",
        id: id
    };
}

export function addMessage(messages) {
    return {
        type: "ADD_MESSAGE",
        messages: messages
    };
}

export function receiveMessage(messages) {
    return {
        type: "RECEIVE_MESSAGE",
        messages: messages
    };
}

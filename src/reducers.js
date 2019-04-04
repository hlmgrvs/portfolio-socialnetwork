export default function(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = Object.assign({}, state, {
            friendsAndWannabes: action.list
        });
        return state;
    }

    if (action.type == "ACCEPT") {
        return {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map(i => {
                if (i.id == action.id) {
                    return { ...i, accepted: true };
                } else {
                    return i;
                }
            })
        };
    }

    if (action.type == "UNFRIEND") {
        return {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map(i => {
                if (i.id == action.id) {
                    return { ...i, accepted: false };
                } else {
                    return i;
                }
            })
        };
    }

    if (action.type == "ONLINE") {
        console.log("action: ", action);
        return {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map(i => {
                if (i.id == action.id) {
                    return { ...i, accepted: false };
                } else {
                    return i;
                }
            })
        };
    }

    if (action.type == "ADD_USER_ID") {
        state = { ...state, userId: action.userId };
        return state;
    }

    if (action.type == "LIST_ONLINE_USERS") {
        state = { ...state, onlineUsers: action.users };
        return state;
    }

    if (action.type == "ADD_ONLINE_USERS_LIST") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.concat(action.user)
        };
        return state;
    }

    if (action.type == "REMOVE_ONLINE_USERS_LIST") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(i => {
                if (i.id == action.id) {
                    return false;
                } else {
                    return true;
                }
            })
        };
        return state;
    }

    if (action.type == "RECEIVE_MESSAGE") {
        state = { ...state, chatMessages: action.messages.reverse() };
        return state;
    }

    if (action.type == "ADD_MESSAGE") {
        console.log("state.chatMessages before concat: ", state.chatMessages);
        state = {
            ...state,
            chatMessages: state.chatMessages.concat(action.newMessage)
        };
        console.log("state.chatMessages after concat: ", state.chatMessages);
        return state;
    }

    console.log("reducers state: ", state);
    return state;
}

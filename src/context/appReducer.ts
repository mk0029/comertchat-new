interface defaultStateType {
    activeTab: string;
    selectedItem: CometChat.Conversation | undefined;
    selectedItemUser: CometChat.User | undefined;
    selectedItemGroup: CometChat.Group | undefined;
    selectedItemCall: CometChat.Call | undefined;
    sideComponent: { visible: boolean, type: string };
    threadedMessage: CometChat.BaseMessage | undefined;
    showNewChat: boolean;
    showJoinGroup: boolean;
    newChat?: {
        user: CometChat.User,
        group: CometChat.Group
    },
    isFreshChat?: boolean;
    pendingRequests: Array<{
        sender: CometChat.User,
        sentAt: number,
        status: "pending" | "accepted" | "rejected",
        type: "user" | "group",
        group?: CometChat.Group
    }>;
    requestsCount: number;
}

export const defaultAppState: defaultStateType = {
    activeTab: "chats",
    selectedItem: undefined,
    selectedItemUser: undefined,
    selectedItemGroup: undefined,
    selectedItemCall: undefined,
    sideComponent: { visible: false, type: "" },
    threadedMessage: undefined,
    showNewChat: false,
    showJoinGroup: false,
    isFreshChat: false,
    pendingRequests: [],
    requestsCount: 0
}

export const appReducer = (state = defaultAppState, action: any) => {
    switch (action.type) {
        case "updateActiveTab": {
            return { ...state, ["activeTab"]: action.payload };
        }
        case "updateSelectedItem": {
            return { ...state, ["selectedItem"]: action.payload };
        }
        case "updateSelectedItemUser": {
            return { ...state, ["selectedItemUser"]: action.payload };
        }
        case "updateSelectedItemGroup": {
            return { ...state, ["selectedItemGroup"]: action.payload };
        }
        case "updateSelectedItemCall": {
            return { ...state, ["selectedItemCall"]: action.payload };
        }
        case "updateSideComponent": {
            return { ...state, ["sideComponent"]: action.payload };
        }
        case "updateThreadedMessage": {
            return { ...state, ["threadedMessage"]: action.payload };
        }
        case "showNewChat": {
            return { ...state, ["showNewChat"]: action.payload };
        }
        case "newChat": {
            return { ...state, ["newChat"]: action.payload, ["showNewChat"]: false };
        }
        case "updateShowJoinGroup": {
            return { ...state, ["showJoinGroup"]: action.payload };
        }
        case "resetAppState": {
            return defaultAppState;
        }
        case 'updateIsFreshChat': {
            return { ...state, isFreshChat: action.payload };
        }
        case "addPendingRequest": {
            const existingRequest = state.pendingRequests.find(
                req => req.sender.getUid() === action.payload.sender.getUid() &&
                    req.type === action.payload.type
            );
            if (existingRequest) {
                return state; // Request already exists
            }
            return {
                ...state,
                pendingRequests: [...state.pendingRequests, action.payload],
                requestsCount: state.requestsCount + 1
            };
        }
        case "updateRequestStatus": {
            const updatedRequests = state.pendingRequests.map(req => {
                if (req.sender.getUid() === action.payload.uid && req.type === action.payload.type) {
                    return { ...req, status: action.payload.status };
                }
                return req;
            });
            return {
                ...state,
                pendingRequests: updatedRequests,
                requestsCount: action.payload.status === "pending" ? state.requestsCount : state.requestsCount - 1
            };
        }
        case "removeRequest": {
            const filteredRequests = state.pendingRequests.filter(
                req => !(req.sender.getUid() === action.payload.uid && req.type === action.payload.type)
            );
            return {
                ...state,
                pendingRequests: filteredRequests,
                requestsCount: state.requestsCount > 0 ? state.requestsCount - 1 : 0
            };
        }

        default: {
            return state;
        }
    }

}
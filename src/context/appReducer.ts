interface ChatRequest {
    sender: CometChat.User;
    receiver?: CometChat.User;
    type: string;
    status: string;
    timestamp: number;
    group?: any;
}

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
    requestsCount?: number;
    pendingRequests: ChatRequest[];
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
    requestsCount: 0,
    pendingRequests: []
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
        case "updateRequestsCount": {
            return { ...state, requestsCount: action.payload };
        }
        case "updatePendingRequests": {
            return { ...state, pendingRequests: action.payload };
        }
        case "updateRequestStatus": {
            const { uid, type, status } = action.payload;
            const updatedRequests = state.pendingRequests.map(request =>
                request.sender.getUid() === uid && request.type === type
                    ? { ...request, status }
                    : request
            );
            return { ...state, pendingRequests: updatedRequests };
        }
        case "removeRequest": {
            const { uid, type } = action.payload;
            const filteredRequests = state.pendingRequests.filter(
                request => !(request.sender.getUid() === uid && request.type === type)
            );
            return { ...state, pendingRequests: filteredRequests };
        }
        case "addRequest":
        case "addPendingRequest": {
            const newRequest = action.payload;
            // Check if request already exists
            const exists = state.pendingRequests.some(
                req => req.sender.getUid() === newRequest.sender.getUid() && req.type === newRequest.type
            );
            if (exists) return state;

            return {
                ...state,
                pendingRequests: [...state.pendingRequests, newRequest],
                requestsCount: state.requestsCount! + 1
            };
        }
        default: {
            return state;
        }
    }
}
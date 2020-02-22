import { LOGIN, SIGNUP, AUTH, LOGOUT } from "../actions/auth"

const initialState = {
    token: null,
    userId: null
}

const authReducer = (state=initialState, action) => {
    switch(action.type){
        case LOGIN:
            return {
                token: action.token,
                userId: action.userId
            }
        case SIGNUP:
            return {
                token: action.token,
                userId: action.userId
            }
        case AUTH:
            return {
                token: action.token,
                userId: action.userId
            }
        case LOGOUT:
            return {
                token:null,
                userId:null
            }
        default:
            return state
    }
}

export default authReducer
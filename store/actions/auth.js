import { AsyncStorage } from "react-native";

export const SIGNUP = 'SIGNUP';
export const LOGIN = "LOGIN";
export const AUTH = 'AUTH';
export const LOGOUT = 'LOGOUT';

export const authenticate = (userId, token) => async dispatch => {
    
    dispatch({type: AUTH, userId: userId, token: token})

}

export const signUp = (email, password) => async dispatch => {
    try {

        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCT2AM6bq7n6ZiC5ynCeXIkXTnejOOcgN4`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email:email,
                password: password,
                returnSecureToken: true
            })
        });
        const data = await res.json()

        if(!res.ok){
            const error = data.error.message;
            let message = ''
            if(error==='EMAIL_EXISTS') message='The email is used by an existing account'
            throw new Error(message)
        }

        dispatch({type:SIGNUP, token: data.idToken, userId: data.localId});
        const expiry = new Date(new Date().getTime() + parseInt(data.expiresIn)*1000);
        saveToStorage(data.idToken, data.localId, expiry.toISOString())

    } catch (err) {
        console.log(err)
        throw err
    }
}

export const logIn = (email, password) => async dispatch => {
    try {

        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCT2AM6bq7n6ZiC5ynCeXIkXTnejOOcgN4',
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email:email,
                password: password,
                returnSecureToken: true
            })
        });        
        const data = await res.json()

        if(!res.ok){
            const error = data.error.message;
            let message = ''
            if(error==='EMAIL_NOT_FOUND') message='The email you entered is incorrect'
            else if(error==='INVALID_PASSWORD') message='The password you entered is incorrect'
            throw new Error(message)
        }

        dispatch({type:LOGIN, token: data.idToken, userId: data.localId});
        const expiry = new Date(new Date().getTime() + parseInt(data.expiresIn)*1000);
        saveToStorage(data.idToken, data.localId, expiry.toISOString())

    } catch (err) {
        console.log(err)
        throw err
    }
}

const saveToStorage = (token, userId, expiry) => {
    AsyncStorage.setItem('userData', JSON.stringify({token, userId, expiry}))
}

export const logOut = () => async dispatch => {
    AsyncStorage.removeItem('userData')
    dispatch({type: LOGOUT})
}
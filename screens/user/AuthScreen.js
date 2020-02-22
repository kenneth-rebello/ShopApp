import React, { useReducer, useCallback, useState, useEffect } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet, Button, View, ActivityIndicator, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors'
import Input from '../../components/UI/Input'
import { useDispatch } from 'react-redux'
import { signUp, logIn } from '../../store/actions/auth'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
    }
    return state;
};

const AuthScreen = ({navigation}) => {

    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          email:'',
          password:''
        },
        inputValidities: {
          email: false,
          password: false
        },
        formIsValid: false
      });

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    },[dispatchFormState]);

    const dispatch = useDispatch();

    const authHandler = async () => {
        setLoading(true)
        setError('')
        try {
            if(isSignUp){
                await dispatch(signUp(formState.inputValues.email, formState.inputValues.password))
            }else{
                await dispatch(logIn(formState.inputValues.email, formState.inputValues.password))
            }
            navigation.navigate('Shop')
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    useEffect(()=>{
        return ()=>{
            setIsSignUp(false)
            setError('')
        }
    })
    useEffect(()=>{
        if(error){
            Alert.alert('Error',error)
        }
    },[error])

    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.container}>
                    <ScrollView>
                        <Input 
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCaptialize="none"
                            errorText="Please enter a valid email address"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            required
                            secureTextEntry
                            minLength={6}
                            autoCaptialize="none"
                            errorMessage="Please enter a valid password"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            {loading ? <ActivityIndicator size="small" color={Colors.primary}/> : <Button title={isSignUp ? "Sign Up" : "Login"} color={Colors.primary} 
                                onPress={authHandler}
                            />}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title={isSignUp ?"Login":"Sign Up"} color={Colors.accent} onPress={()=>{
                                setIsSignUp(!isSignUp)
                            }}/>
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = {
    title:'Login'
}

const styles = StyleSheet.create({
    screen:{
        flex:1
    },
    gradient:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    container:{
        width:'80%',
        maxWidth: 400,
        maxHeight: 400,
        padding:10
    },
    buttonContainer:{
        padding:5
    }
})

export default AuthScreen
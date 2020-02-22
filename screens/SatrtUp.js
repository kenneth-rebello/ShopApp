import React, { useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native';
import Colors from '../constants/Colors';
import { useDispatch } from 'react-redux';
import { authenticate } from '../store/actions/auth';

const SatrtUpScreen = ({navigation}) => {

    const dispatch = useDispatch()

    useEffect(()=>{
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            const user = JSON.parse(userData)

            if(!userData){
                navigation.navigate('Auth')
            }

            const {token, userId, expiry} = user;

            const expiryDate = new Date(expiry);

            if(expiryDate <= new Date() || !token || !userId){
                navigation.navigate('Auth')
                return;
            }else{
                dispatch(authenticate(userId, token))
                navigation.navigate('Shop')
                return;
            }
        }
        tryLogin()
    },[])

    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={Colors.accent}/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:Colors.primary
    }
})

export default SatrtUpScreen;
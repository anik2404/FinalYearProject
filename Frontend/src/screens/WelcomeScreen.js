import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text,StyleSheet,Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const ring1padding=useSharedValue(0);
    const ring2padding=useSharedValue(0);
    const navigation=useNavigation();
    useEffect(()=>{
        ring1padding.value=0;
        ring2padding.value=0;
        setTimeout(()=>ring1padding.value=withSpring(ring1padding.value+hp(4.5),100))
        setTimeout(()=>ring2padding.value=withSpring(ring2padding.value+hp(3.5),300))
        setTimeout(()=>navigation.navigate('Home'),3000)
    },[])
  return (
      <View style={styles.welcomescreen}>
        <StatusBar style="light"/>
        <Animated.View style={{backgroundColor: 'rgba(255, 255, 255, 0.2)',alignContent:"center",alignItems:"center",borderRadius:9999,
        marginTop:hp(28),padding:ring1padding}}> 
            <Animated.View style={{backgroundColor: 'rgba(255, 255, 255, 0.2)',alignContent:"center",alignItems:"center",borderRadius:9999,
            padding:ring2padding}}>
                <Image style={{height:hp(27),width:wp(54)}} source={require("../../assets/1869042.png")}></Image>
            </Animated.View>
        </Animated.View>
      </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    welcomescreen:{
        flex:1,
        backgroundColor: "#f6700d",
        alignContent:'center',
        alignItems:'center'
    },
    name:{
        fontSize:hp(5),
        fontWeight:'bold',
        "color":"white"
    }
})
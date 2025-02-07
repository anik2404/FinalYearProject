import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React,{useEffect, useState} from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Animated,{FadeIn, FadeInDown} from 'react-native-reanimated';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Entypo'
import axios from 'axios';
import Loading from '../components/Loading';
import RecipieDescription from '../components/RecipieDescription';

const RecipeDetailScreen = (props) => {
    const navigation=useNavigation();
    const [isFavourite,setIsFavourite]=useState(false);
    const [meal,setMeal]=useState(null);
    const [loading,setLoading]=useState(true);
    let item=props.route.params;

    useEffect(()=>{
        getMealData(item.idMeal);
    })

    const getMealData = async (id) => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            //console.log(response.data)
            if (response && response.data) {
                setMeal(response.data.meals[0]);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
  return (
    <ScrollView
    style={{backgroundColor:'white',flex:1}}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom:hp(3)}}>
        <StatusBar style={"light"}/>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
            <Image
                source={{uri:item.strMealThumb}}
                sharedTransitionTag={item.strMeal}
                style={{width:wp(95),height:hp(50),borderRadius:27,marginTop:hp(1),borderBottomLeftRadius:40,borderBottomRightRadius:40}}
            />
        </View>
        <Animated.View entering={FadeIn.delay(200).duration(1000)}style={{position:'absolute',flexDirection:'row',justifyContent:'space-between',padding:35,paddingLeft:20}}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}} style={{marginLeft:5,backgroundColor:'white',borderRadius:9999,height:hp(5),width:wp(10),alignItems:'center'}}>
                <Icon name="chevron-left" size={35} color='orange' marginTop={hp(0.3)}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setIsFavourite(!isFavourite)}} style={{marginLeft:hp(33),backgroundColor:'white',borderRadius:9999,height:hp(5),width:wp(10),alignItems:'center'}}>
                <Icon name="heart" size={30} color={isFavourite ?"red":"gray"} style={{marginTop:hp(0.7)}}/>
            </TouchableOpacity>
        </Animated.View>
        {
            loading?(
                <Loading size="large" marginTop={hp(5)}/>
            ):(
                <RecipieDescription meal={meal}/>
            )
        }
    </ScrollView>
  );
};

export default RecipeDetailScreen;
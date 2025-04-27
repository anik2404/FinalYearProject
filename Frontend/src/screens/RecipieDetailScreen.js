import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React,{useEffect, useState,useContext} from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Animated,{FadeIn, FadeInDown} from 'react-native-reanimated';
import { AuthContext } from "../context/AuthContext";
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
    const { userid } = useContext(AuthContext);
    const [likes,setlikes]=useState(0);
    const [fdata, setFdata] = useState({
        idMeal: item.idMeal,
        likes:1,
        isFavourite:false,
        userid:userid,
    })

    useEffect(()=>{
        getMealData(item.idMeal);
        checkIfLiked();
        totallikes();
    },[])

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

    const checkIfLiked = async () => {
        try {
            const response = await fetch(`http://192.168.85.156:3000/recipie/isLiked`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idMeal: item.idMeal, userid: userid })
            });
            const data = await response.json();
            setIsFavourite(data.isFavourite);
        } catch (error) {
            console.log(error);
        }
    };

    const totallikes=async()=>{
        try {
            const response = await fetch(`http://192.168.85.156:3000/recipie/totallikes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idMeal: item.idMeal})
            });
            const data = await response.json();
            setlikes(data.likecount);
        } catch (error) {
            console.log(error);
        }
    }

    const likecount=()=>{
        if ((fdata.userid == null) ||(fdata.userid=='null')) {
            alert('You need to login first to like any recipie')
        }
        else {
            const newFavouriteState = !isFavourite;
            setIsFavourite(newFavouriteState);
            fdata.isFavourite=newFavouriteState;
            fetch('http://192.168.85.156:3000/recipie/likecount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fdata)
            })
              .then(res => res.json()).then(
                data => {
                    if (data.error) {
                        setErrorMsg(data.error)
                    }
                    else {
                        setlikes(data.likes)
                        console.log(data.likes)
                    }
                }
              )
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
        <Animated.View entering={FadeIn.delay(200).duration(1000)}style={{position:'absolute',flexDirection:'row',padding:35,paddingLeft:10}}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}} style={{marginLeft:5,backgroundColor:'white',borderRadius:9999,height:hp(8),width:wp(16),alignItems:'center'}}>
                <Icon name="chevron-left" size={55} color='orange' marginTop={hp(0.3)}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{likecount()}} style={{marginRight:wp(50),marginLeft:hp(30),backgroundColor:'white',borderRadius:9999,height:hp(8),width:wp(16),alignItems:'center'}}>
                <Icon name="heart" size={30} color={isFavourite ?"red":"gray"} style={{marginTop:hp(0.7)}}/>
                <Text>{likes}</Text>
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
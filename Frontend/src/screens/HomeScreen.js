import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState ,useContext } from 'react';
import { View, Text,StyleSheet,Image,TextInput,ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import axios from 'axios';
import Categories from '../components/Categories';
import Recipies from '../components/Recipies';
import AddedRecipies from '../components/AddedRecipies';
import { AuthContext } from "../context/AuthContext";

const HomeScreen = () => {
    const [categories,setcategories]=useState([]);
    const [activecategory,setactivecategory]=useState('');
    const [meals,setmeals]=useState([]);
    const [addedmeals,setaddedmeals]=useState({"idMeal":""});
    const [fdata, setFdata] = useState({
        recipie: "",
    })
    useEffect(()=>{
        getCategories();
        getrecipies();
        //fetchToken();
    },[])

    const handlechangecategory=catagory=>{
        getrecipies(catagory);
        setactivecategory(catagory);
        setmeals([]);
    }

    const getCategories=async()=>{
        try {
            const response=await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
            if(response&&response.data)
            {
                setcategories(response.data.categories)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    //const fetchToken = async () => {
    //    const storedUserid = await AsyncStorage.getItem("userid");
    //    setuserid(storedUserid);
    //};

    const getrecipies = async (catagory = "Beef") => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catagory}`)
            if (response && response.data) {
                setmeals(response.data.meals)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const getsearchedrecipies=async() => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${fdata.recipie}`)
            //console.log(response.data)
            if (response.data.meals) {
                setmeals(response.data.meals)
                //console.log(response.data.meals)
            }
            else{
                fetch('http://192.168.104.156:3000/addedrecipie/get', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fdata)
                  })
                    .then(res => res.json()).then(
                      data => {
                        if (data.error) {
                          setErrorMsg(data.error);
                        }
                        else {
                          //console.log(data.saved_recipie);
                          setmeals(data.saved_recipie)
                        }
                      }
                    )
            }
        } catch (error) {
            console.log(error.message);
        }
    }
  return (
    <View style={styles.homescreen}>
        <StatusBar style="dark"/>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:hp(3)}}
        >
            <View style={styles.container}>
                <Text style={{color:'orange',fontSize:hp(3.8),fontWeight:'bold'}}>RecipieFusion</Text>
                <Text style={{fontSize:hp(2),marginTop:hp(2),fontWeight:'bold'}}>Hello User,</Text>
                <Text style={{fontSize:hp(2)}}>Let's try some new food with us</Text>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Search Recipies"
                    placeholderTextColor="gray"
                    onChangeText={(text) => setFdata({ ...fdata, recipie: text })}
                />
                <View style={{backgroundColor: 'white',alignContent:"center",alignItems:"center",borderRadius:9999,marginRight:wp(1),marginTop:hp(0.5),height:hp(5.5),width:wp(11)}}>
                    <Icon1 name="search" color="black" size={hp(4)} marginTop={hp(0.6)} onPress={()=>getsearchedrecipies()}  />
                </View>
            </View>
            <View>
                {categories.length>0 && <Categories categories={categories} activecategory={activecategory} handlechangecategory={handlechangecategory}/>}
            </View>
            <View style={{padding:hp(1.5)}}>
                <Recipies categories={categories} meals={meals}/>
            </View>
        </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    homescreen:{
        flex:1,
        backgroundColor: "#fff",
    },
    container:{
        flexDirection:'column',
        justifyContent:'space-between',
        marginTop:hp(5.5),
        marginLeft:wp(5)
    },
    inputView: {
        flexDirection:'row',
        marginTop:hp(4),
        backgroundColor: "#ede9e7",
        borderRadius: 30,
        width: wp(90),
        height: hp(6.5),
        marginLeft: wp(5),
      },
      TextInput: {
        flex: 1,
        padding: wp(1),
        "color": "#312e81",
        fontWeight: "bold",
        marginLeft: wp(5),
        fontSize: hp(2),
      },
})
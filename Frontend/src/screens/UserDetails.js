import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon3 from 'react-native-vector-icons/Ionicons'
import Details from '../components/Details';
import Recipies from '../components/Recipies';

const UserDetails = () => {
    const navigation = useNavigation()
    const { userid, setuserid } = useContext(AuthContext);
    const { setusername } = useContext(AuthContext);
    const [userdetails, setuserdetails] = useState([]);
    const [likeduser, setlikeduser] = useState([]);
    const [meals, setmeals] = useState([]);
    const [bookmarkeduser, setbookmarkeduser] = useState([]);

    useFocusEffect(
        useCallback(() => {
            getUserData();
            bookmarkedrecipieData();
        }, [])
    );

    const getUserData = async () => {
        fetch('http://192.168.184.156:3000/userdetails/getdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: userid })
        })
            .then(res => res.json()).then(
                async (data) => {
                    if (data.error) {
                        setErrorMsg(data.error);
                    }
                    else {
                        //console.log(data.liked_recipies);
                        setuserdetails(data.saved_user);
                        setlikeduser(data.liked_recipies);
                        setbookmarkeduser(data.bookmarked_recipies)
                        setusername(data.name);
                    }
                }
            )
    }
    
    
    const bookmarkedrecipieData = async () => {
        try {
            const mealdata = [];
    
            for (let i = 0; i < bookmarkeduser.length; i++) {
                const idMeal = bookmarkeduser[i].idMeal;
    
                try {
                    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    
                    // Check if it's a valid MealDB recipe
                    if (response.data.meals && response.data.meals.length > 0) {
                        mealdata.push(response.data.meals[0]);
                    } else {
                        // Try your own backend if not found in MealDB
                        const localResponse = await fetch('http://192.168.184.156:3000/addedrecipie/getbookmarkedrecipie', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id: idMeal }),
                        });
    
                        const localData = await localResponse.json();
    
                        if (localData && localData.saved_recipie) {
                            mealdata.push(...localData.saved_recipie); // use spread in case it's an array
                        }
                    }
                } catch (innerErr) {
                    console.error(`Error fetching recipe for id ${idMeal}:`, innerErr.message);
                }
            }
            setmeals(mealdata);
        } catch (error) {
            console.error("Error fetching bookmarked recipes:", error.message);
        }
    };
    

    return (
        <ScrollView
            style={{ backgroundColor: '#F5FCFF', flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: hp(8)
            }}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.heading}>{userdetails.name}</Text>
                <TouchableOpacity style={styles.signupBtn}>
                    <Icon3 style={styles.icon} name="arrow-back-outline" onPress={() => {
                        setuserid(null)
                        setusername("User")
                        navigation.navigate('UserMain');
                    }} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.headingText}>No of liked Recipies: </Text>
                <Text style={styles.detailsText}>{likeduser.length}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.headingText}>No of bookmarked Recipies: </Text>
                <Text style={styles.detailsText}>{bookmarkeduser.length}</Text>
            </View>
            <View style={{ padding: hp(1.5) }}>
                <Text style={{ fontSize: hp(3), marginBottom: hp(2.5), fontWeight: '600', color: 'orange' }}>Recipies</Text>
                <Recipies meals={meals} />
            </View>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    loginBtn: {
        width: "70%",
        borderRadius: 30,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginLeft: 55,
        backgroundColor: "#FA0ED6",
    },
    loginText: {
        fontSize: 20,
        "color": "#77F3F7",
        fontWeight: "bold"
    },
    headingText: {
        fontSize: hp(2.3),
        paddingLeft: wp(8),
        marginTop: hp(2)
    },
    heading: {
        fontSize: hp(3.5),
        fontWeight: "500",
        color: "orange",
        paddingLeft: wp(8),
        paddingTop: hp(6)
    },
    detailsText: {
        fontSize: hp(2.3),
        paddingLeft: hp(1),
        marginTop: hp(2)
    },
    signupBtn: {
        width: hp(8),
        borderRadius: hp(3),
        height: hp(5.5),
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp(6),
        marginLeft: wp(20),
        backgroundColor: "#fff",
        elevation: 10,
        borderColor: 'orange',
        borderWidth: hp(0.2),
    },
    icon: {
        fontSize: hp(4),
        color: "orange"
    },
})

export default UserDetails;
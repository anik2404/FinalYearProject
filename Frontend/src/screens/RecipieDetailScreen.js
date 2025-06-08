import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useContext, useCallbackt } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList, TextInput, Button,Easing, } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AuthContext } from "../context/AuthContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Entypo'
import axios from 'axios';
import Loading from '../components/Loading';
import RecipieDescription from '../components/RecipieDescription';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentBox from '../components/CommentBox';

const RecipeDetailScreen = (props) => {
    const navigation = useNavigation();
    const [isFavourite, setIsFavourite] = useState(false);
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    let item = props.route.params;
    const { userid } = useContext(AuthContext);
    const [likes, setlikes] = useState(0);
    const [fdata, setFdata] = useState({
        idMeal: item.idMeal,
        likes: 1,
        isFavourite: false,
        userid: userid,
    })

    useEffect(() => {
        getMealData(item.idMeal);
        checkIfLiked();
        totallikes();
    }, [])

    

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
            const response = await fetch(`http://192.168.184.156:3000/recipie/isLiked`, {
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

    const totallikes = async () => {
        try {
            const response = await fetch(`http://192.168.184.156:3000/recipie/totallikes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idMeal: item.idMeal })
            });
            const data = await response.json();
            setlikes(data.likecount);
        } catch (error) {
            console.log(error);
        }
    }

    const likecount = () => {
        if ((fdata.userid == null) || (fdata.userid == 'null')) {
            alert('You need to login first to like any recipie')
        }
        else {
            const newFavouriteState = !isFavourite;
            setIsFavourite(newFavouriteState);
            fdata.isFavourite = newFavouriteState;
            fetch('http://192.168.184.156:3000/recipie/likecount', {
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
                            //console.log(data.likes)
                        }
                    }
                )
        }
    }


    return (
        <ScrollView
            style={{ backgroundColor: 'white', flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp(3) }}>
            <StatusBar style={"light"} />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image
                    source={{ uri: item.strMealThumb }}
                    sharedTransitionTag={item.strMeal}
                    style={{ width: wp(95), height: hp(50), borderRadius: 27, marginTop: hp(1), borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
                />
            </View>
            <Animated.View entering={FadeIn.delay(200).duration(1000)} style={{ position: 'absolute', flexDirection: 'row', padding: 35, paddingLeft: 10 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginLeft: 5, backgroundColor: 'white', borderRadius: 9999, height: hp(8), width: wp(16), alignItems: 'center' }}>
                    <Icon name="chevron-left" size={55} color='orange' marginTop={hp(0.3)} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { likecount() }} style={{ marginRight: wp(50), marginLeft: hp(30), backgroundColor: 'white', borderRadius: 9999, height: hp(8), width: wp(16), alignItems: 'center' }}>
                    <Icon name="heart" size={30} color={isFavourite ? "red" : "gray"} style={{ marginTop: hp(0.7) }} />
                    <Text>{String(likes)}</Text>
                </TouchableOpacity>
            </Animated.View>
            {
                loading ? (
                    <Loading size="large" marginTop={hp(5)} />
                ) : (
                    <>
                        <RecipieDescription meal={meal} />
                        <CommentBox idMeal={item.idMeal} />
                    </>
                )
            }
        </ScrollView>
    );
};

export default RecipeDetailScreen;

const styles = StyleSheet.create({
    homepageContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 320,
        backgroundColor: '#ffffff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        overflow: 'hidden',
        zIndex: 999,
    },
    bookmarkButton: {
        width: 40,
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    bookmarkIcon: {
        fontSize: 24,
        color: '#000',
    },
    commentBoxFull: {
        flex: 1,
        padding: 12,
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111',
        marginBottom: 8,
    },
    closeText: {
        fontSize: 30,
        fontWeight: '700',
        color: '#111',
        lineHeight: 30,
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        color: '#111',
        minHeight: 48,
        textAlignVertical: 'top',
        marginBottom: 8,
    },
    button: {
        alignSelf: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 12,
        transitionDuration: '300ms',
    },
    buttonEnabled: {
        backgroundColor: '#000',
    },
    buttonDisabled: {
        backgroundColor: '#888',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    commentList: {
        maxHeight: 200,
    },
    commentItem: {
        marginBottom: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingBottom: 8,
    },
    commentUser: {
        fontWeight: '700',
        fontSize: 14,
        color: '#333',
    },
    commentText: {
        fontSize: 16,
        color: '#222',
        marginVertical: 4,
    },
    commentTime: {
        fontSize: 12,
        color: '#666',
    },
    noCommentsText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#999',
        textAlign: 'center',
        marginTop: 16,
    },
})
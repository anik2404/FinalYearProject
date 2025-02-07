import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { FadeInDown } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import YoutubeIframe from 'react-native-youtube-iframe';

const RecipieDescription = ({meal}) => {
    const ingredientsIndexes=(meal)=>{
        if(!meal) return [];
        let indexes=[];
        for(let i=1;i<20;i++)
        {
            if(meal['strIngredient'+i]){
                indexes.push(i);
            }
        }
        return indexes;
    }
    const getYouTubeVideoId=uri=>{
        const regex= /[?&]v=([^&]+)/;
        const match=uri.match(regex);
        if(match&&match[1])
            return match[1];
        return null;
    }
    return (
        <View style={{ flex: 1, paddingTop: hp(4) }}>
            <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} style={{ marginLeft: wp(3) }}>
                <Text style={{ fontSize: hp(3), fontWeight: "bold", flex: 1 }}>
                    {
                        meal?.strMeal
                    }
                </Text>
                <Text style={{ fontSize: hp(2), fontWeight: "condensedBold", flex: 1, marginTop: hp(0.5),marginBottom:hp(4)}}>
                    {
                        meal?.strArea
                    }
                </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} style={{marginLeft:wp(3),marginBottom:hp(4),marginRight:wp(3)}}>
                <Text style={{ fontSize: hp(3), fontWeight: "bold", flex: 1,marginBottom:hp(2)}}>Ingredients</Text>
                {
                    ingredientsIndexes(meal).map(i=>{
                        return(
                            <View key={i} style={{flexDirection:'row'}}>
                                <View style={{marginTop:hp(1),height:hp(1.5),width:wp(3),borderRadius:9999,backgroundColor:"orange",marginBottom:hp(2),marginLeft:wp(3)}}/>
                                <View style={{flexDirection:'row',marginBottom:hp(2),marginLeft:wp(4)}}>
                                    <Text style={{fontSize:hp(2.1),fontWeight:'bold'}}>{meal['strMeasure'+i]}</Text>
                                    <Text style={{fontSize:hp(2.1),marginLeft:wp(1)}}>{meal['strIngredient'+i]}</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} style={{marginLeft:wp(3),marginBottom:hp(4),marginRight:wp(3)}}>
                <Text style={{ fontSize: hp(3), fontWeight: "bold", flex: 1,marginBottom:hp(2)}}>Instructions</Text>
                <Text style={{fontSize:hp(2)}}>
                    {
                        meal?.strInstructions
                    }
                </Text>
            </Animated.View>
            {
                meal.strYoutube && (
                    <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} style={{marginLeft:wp(3),marginBottom:hp(4),marginRight:wp(3)}}>
                        <Text style={{ fontSize: hp(3), fontWeight: "bold", flex: 1,marginBottom:hp(2)}}>Recipie Video</Text>
                        <View>
                            <YoutubeIframe
                            videoId={getYouTubeVideoId(meal.strYoutube)}
                            height={hp(30)}/>
                        </View>
                    </Animated.View>
                )
            }
        </View>
    );
};

export default RecipieDescription;
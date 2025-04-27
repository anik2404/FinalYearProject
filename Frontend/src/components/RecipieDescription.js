import React,{useState,useEffect,useContext} from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { FadeInDown } from 'react-native-reanimated';
import { AuthContext } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/Entypo'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import YoutubeIframe from 'react-native-youtube-iframe';

const RecipieDescription = ({meal}) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { userid } = useContext(AuthContext);

    useEffect(() => {
        checkIfBookmarked();
    }, []);

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

    const toggleBookmark = async () => {
        if ((userid == null) ||(userid=='null')) {
            alert('You need to login first to bookmark any recipie')
        }
        else{
            try {
                const response = await fetch(`http://192.168.85.156:3000/recipie/bookmark`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idMeal: meal.idMeal, userid })
                });
                const data = await response.json();
                setIsBookmarked(data.bookmarked);
            } catch (error) {
                console.log(error);
            }
        }
    };  
    
    const checkIfBookmarked = async () => {
        try {
            const response = await fetch(`http://192.168.85.156:3000/recipie/isBookmarked`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idMeal: meal.idMeal, userid })
            });
            const data = await response.json();
            setIsBookmarked(data.bookmarked);
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <View style={{ flex: 1, paddingTop: hp(4) }}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
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
                <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} style={{ marginLeft: wp(3) }}>
                    <TouchableOpacity onPress={toggleBookmark}
                    style={{marginRight:wp(1),backgroundColor:'white',
                    borderRadius:9999,height:hp(8),width:wp(16),alignItems:'center'}}>
                        <Icon name="bookmark" size={50} color={isBookmarked ? "orange" : "black"} style={{marginTop:hp(1)}}/>
                    </TouchableOpacity> 
                </Animated.View>
            </View>
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
                <Text style={{ fontSize: hp(3), fontWeight: "bold",marginBottom:hp(2)}}>Instructions</Text>
                <Text style={{fontSize:hp(2),textAlign:'justify'}}>
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
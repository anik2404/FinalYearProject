import React,{useState,useEffect,useContext} from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { FadeInDown } from 'react-native-reanimated';
import { AuthContext } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/Entypo'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import YoutubeIframe from 'react-native-youtube-iframe';

const AddedRecipieDescription = ({meal}) => {
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
                const response = await fetch(`http://192.168.0.111:3000/recipie/bookmark`, {
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
            const response = await fetch(`http://192.168.0.111:3000/recipie/isBookmarked`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idMeal: meal._id, userid })
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
                            meal?.rname
                        }
                    </Text>
                    <Text style={{ fontSize: hp(2), fontWeight: "condensedBold", flex: 1, marginTop: hp(0.5),marginBottom:hp(4)}}>
                        {
                            meal?.region
                        }
                    </Text>
                </Animated.View>
            </View>
            <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} style={{marginLeft:wp(3),marginBottom:hp(4),marginRight:wp(3)}}>
                <Text style={{ fontSize: hp(3), fontWeight: "bold",marginBottom:hp(2)}}>Instructions</Text>
                <Text style={{fontSize:hp(2),textAlign:'justify'}}>
                    {
                        meal?.instructions
                    }
                </Text>
            </Animated.View>
        </View>
    );
};

export default AddedRecipieDescription;
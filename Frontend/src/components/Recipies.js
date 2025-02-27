import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MasonryList from '@react-native-seoul/masonry-list';
import Animated,{FadeInDown} from 'react-native-reanimated';
import Loading from './Loading';
import { DummyData } from '../constants/DummyData';
import { CachedImage } from '../helpers/Image';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Recipies = ({categories,meals}) => {
    const navigation=useNavigation();
  return (
    <View>
        <Text style={{fontSize:hp(3),marginBottom:hp(2.5),fontWeight:'600',color:'orange'}}>Recipies</Text>
        <View>
            {
                categories.length==0 || meals.length==0 ? (
                    <Loading size="large" style={{marginTop:hp(5)}}/>
                ):(
                    <MasonryList
                    data={meals}
                    keyExtractor={(item)=> item.idMeal}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item,i}) => <RecipieCard item={item} index={i} navigation={navigation}/>}
                    onEndReachedThreshold={0.1}
                    />
                )
            }
        </View>
    </View>
  );
};

const RecipieCard=({item,index,navigation})=>{
    let isEven=index%2==0;
    return(
        <Animated.View entering={FadeInDown.delay(index*100).delay(600).springify().damping(12)}>
            <Pressable
            style={{width:'100%',paddingLeft: isEven? 0:8,paddingRight:isEven ?8:0,marginBottom:hp(2),alignItems:'center'}}
            onPress={()=>navigation.navigate('RecipieDetail',{...item})}>
                <Image
                source={{uri:item.strMealThumb}}
                style={{width:'100%',height:index%3==0?hp(25):hp(35),borderRadius:35}}
                sharedTransitionTag={item.strMeal}/>
                <Text style={{fontSize:hp(2),marginTop:hp(1),fontWeight:'600'}}>
                    {
                        item.strMeal.length>20?item.strMeal.slice(0,20)+'...':item.strMeal
                    }
                </Text>
            </Pressable>
        </Animated.View>
    )
}


export default Recipies;
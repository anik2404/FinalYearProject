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

const Recipies = ({meals}) => {
    const navigation=useNavigation();
    //console.log(meals)
  return (
    <View>
        <View>
            {
                meals.length==0 ? (
                    <Loading size="large" style={{marginTop:hp(5)}}/>
                ):(
                    meals[0].idMeal!==""?
                        <MasonryList
                        data={meals}
                        keyExtractor={(item)=> item.idMeal}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item,i}) => <RecipieCard item={item} index={i} navigation={navigation}/>}
                        onEndReachedThreshold={0.1}
                        />:
                        <MasonryList
                        data={meals}
                        keyExtractor={(item)=> item._id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item,i}) => <AddedRecipieCard items={item} index={i} navigation={navigation}/>}
                        onEndReachedThreshold={0.1}
                        />
                    )
            }
        </View>
    </View>
  );
};

const AddedRecipieCard=({items,index,navigation})=>{
    let isEven=index%2==0;
    //console.log(items)
    return(
        <Animated.View entering={FadeInDown.delay(index*100).delay(600).springify().damping(12)}>
            <Pressable
            style={{width:'100%',paddingLeft: isEven? 0:8,paddingRight:isEven ?8:0,marginBottom:hp(2),alignItems:'center'}}
            onPress={()=>navigation.navigate('AddRecipieDetail',{...items})}>
                <Image
                source={{uri:items.avatar}}
                style={{width:'100%',height:index%3==0?hp(25):hp(35),borderRadius:35}}
                sharedTransitionTag={items.rname}/>
                <Text style={{fontSize:hp(2),marginTop:hp(1),fontWeight:'600',color:index==0?"orange":"black"}}>
                    {
                        items.rname?.length>20?items.rname.slice(0,20)+'...':items.rname
                    }
                </Text>
                {index==0?<Text style={{fontSize:hp(2),marginTop:hp(1),fontWeight:'600',color:"orange"}}>AI suggested recipie</Text>:<Text></Text>}
            </Pressable>
        </Animated.View>
    )
}

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
                        item.strMeal?.length>20?item.strMeal.slice(0,20)+'...':item.strMeal
                    }
                </Text>
            </Pressable>
        </Animated.View>
    )
}


export default Recipies;
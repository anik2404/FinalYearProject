import React from 'react';
import { View, Text, TouchableOpacity,Image,ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Animated,{FadeInDown} from 'react-native-reanimated';
import { CachedImage } from '../helpers/Image';

const Categories = ({categories,activecategory,handlechangecategory}) => {
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal:15}}>
        {
            categories.map((cat,index)=>{
                let isActive=cat.strCategory==activecategory;
                let activeButtonClass=isActive?{marginTop:hp(4),alignContent:'space-between',alignItems:'center',borderRadius:9999,height:hp(13),width:wp(26),backgroundColor:"orange"}:{marginTop:hp(4),alignContent:'space-between',alignItems:'center',borderRadius:9999,height:hp(13),width:wp(26),backgroundColor:"white"}
                return(
                    <TouchableOpacity key={index} style={{paddingHorizontal:wp(1),alignItems:'center'}} onPress={()=>handlechangecategory(cat.strCategory)}>
                        <View style={activeButtonClass}>
                            <Image
                            source={{uri:cat.strCategoryThumb}}
                            style={{height:hp(10),width:wp(20),borderRadius:9999,marginTop:hp(1.5)}}/>
                        </View>
                        <Text style={{fontSize:hp(1.7),fontWeight:'600',marginTop:hp(1)}}>{cat.strCategory}</Text>
                    </TouchableOpacity>
                )
            })
        }
    </ScrollView>
    </Animated.View>
  );
};

export default Categories;
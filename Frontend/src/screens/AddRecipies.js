import React from 'react';
import { View, Text } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const AddRecipies = () => {
  return (
    <View style={{marginTop:hp(50),alignItems:'center'}}>
      <Text>Add Recipies</Text>
    </View>
  );
};

export default AddRecipies;
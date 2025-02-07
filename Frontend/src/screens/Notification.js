import React from 'react';
import { View, Text } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Notification = () => {
  return (
    <View style={{marginTop:hp(50),alignItems:'center'}}>
      <Text>Notification</Text>
    </View>
  );
};

export default Notification;
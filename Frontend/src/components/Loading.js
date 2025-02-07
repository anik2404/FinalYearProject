import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const Loading = (props) => {
  return (
    <View style={{alignItems:'center'}}>
        <ActivityIndicator {...props} />
    </View>
  );
};

export default Loading;
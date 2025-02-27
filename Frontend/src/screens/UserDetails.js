import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity ,StyleSheet} from 'react-native';

const UserDetails = () => {
    const navigation = useNavigation()
    return (
        <View>
            <Text>User Details</Text>
            <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginText}
                    onPress={() => {
                        navigation.navigate('UserMain');
                    }}
                >LOGOUT</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loginBtn: {
        width: "70%",
        borderRadius: 30,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginLeft: 55,
        backgroundColor: "#FA0ED6",
    },
    loginText:{
        fontSize: 20,
        "color": "#77F3F7",
        fontWeight: "bold"
    },
})

export default UserDetails;
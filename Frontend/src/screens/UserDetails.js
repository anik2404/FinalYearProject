import { useNavigation,useRoute } from '@react-navigation/native';
import React, { useState ,useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { View, Text, TouchableOpacity ,StyleSheet} from 'react-native';

const UserDetails = () => {
    const navigation = useNavigation()
    const { setuserid } = useContext(AuthContext);
    const route=useRoute()
    const id = route.params?.userid;
    const [uid,setuid]=useState(id)
    return (
        <View>
            <Text>User Details</Text>
            <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginText}
                    onPress={() => {
                        //setuid(null);
                        setuserid("null")
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
import React, { useState } from "react";
import tw from 'twrnc';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon1 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/AntDesign';

const ResetPass = () => {
  const route = useRoute()
  const id1 = route.params?.id;
  const navigation = useNavigation()
  const [fdata, setFdata] = useState({
    newpsswd: "",
    connewpsswd: "",
    uid: id1
  })
  const [errormsg, setErrorMsg] = useState(null);
  const sendToBackend = () => {
    if ((fdata.newpsswd == "") || (fdata.connewpsswd == "")) {
      setErrorMsg("All fields are required")
    }
    else if (fdata.connewpsswd != fdata.newpsswd) {
      setErrorMsg("Confirm password not matched")
    }
    else {
      fetch('http://192.168.184.156:3000/user/resetpass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fdata)
      })
        .then(res => res.json()).then(
          data => {
            if (data.error) {
              setErrorMsg(data.error);
            }
            else {
              alert('Password Updated Succesfully')
              navigation.navigate('UserMain');
            }
          }
        )
    }
  }
  return (

    <View style={{ flex: 1, alignContent: "center", backgroundColor: '#F5FCFF' }}>
      <Text style={styles.resetText}>RESET PASSWORD</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter New Password"
          placeholderTextColor="#000"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, newpsswd: text })}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Confirm your New Password"
          placeholderTextColor="#000"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, connewpsswd: text })}
        />
      </View>
      <View>
        {
          errormsg ? <Text style={{ "color": "red", marginLeft: wp(30), marginTop: hp(2) }}>{errormsg}</Text> : null
        }
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.setpasstext}>Set Password</Text>
        <TouchableOpacity style={styles.setpassBtn}>
          <Icon1 style={styles.icon} name="arrow-forward-outline" onPress={() => sendToBackend()} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default ResetPass;

const styles = StyleSheet.create({
  resetText:
  {
    marginLeft: wp(13),
    marginTop: hp(25),
    marginBottom: hp(8),
    fontSize: hp(4),
    fontWeight: "500",
    color: "orange"
  },
  inputView: {
    backgroundColor: "#fff",
    borderRadius: hp(3),
    width: wp(80),
    height: hp(6),
    marginLeft: wp(10),
    elevation: 10,
    marginBottom: hp(4),
    borderColor: 'orange',
    borderWidth: hp(0.2),
  },
  TextInput: {
    flex: 1,
    padding: hp(1.5),
    "color": "#000",
    fontWeight: "bold",
    fontSize: hp(2.1),
    marginLeft: wp(4)
  },
  setpassBtn: {
    width: hp(8),
    borderRadius: hp(3),
    height: hp(5.5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(8),
    marginLeft: wp(1.5),
    backgroundColor: "#fff",
    elevation: 10,
    borderColor: 'orange',
    borderWidth: hp(0.2),
  },
  setpasstext:
  {
    color: "#000",
    fontSize: hp(3),
    height: hp(5),
    fontWeight: "500",
    marginTop: hp(8.5),
    marginLeft: wp(30)
  },
  icon: {
    fontSize: hp(4),
    color: "orange"
  },
});
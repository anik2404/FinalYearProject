import React, { useState } from "react";
import tw from 'twrnc';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import Icon1 from 'react-native-vector-icons/Ionicons'

const ForgotPass = () => {
  const navigation = useNavigation()
  const [fdata, setFdata] = useState({
    reemail: "",
  })
  const [errormsg, setErrorMsg] = useState(null);
  const sendToBackend = () => {
    if ((fdata.reemail == "")) {
      setErrorMsg("All fields are required")
    }
    else {
      fetch('http://192.168.184.156:3000/user/forgotpass', {
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
              q = data.p
              navigation.navigate('ResetPassword', { id: q })
            }
          }
        )
    }

  }
  return (

    <View style={{ flex: 1, backgroundColor: '#F5FCFF' }}>
      <Text style={styles.forgotText}>FORGOT PASSWORD</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter your registered email"
          placeholderTextColor="#003f5c"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, reemail: text })}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.confirmtext}>Confirm</Text>
        <TouchableOpacity style={styles.confirmBtn}>
          <Icon1 style={styles.icon} name="arrow-forward-outline" onPress={() => sendToBackend()} />
        </TouchableOpacity>
      </View>
      <View>
        {
          errormsg ? <Text style={{ "color": "red" }}>{errormsg}</Text> : null
        }
      </View>
    </View>

  );
}
export default ForgotPass;

const styles = StyleSheet.create({
  forgotText:
  {
    height: hp(10),
    marginLeft: wp(14),
    marginTop: hp(35),
    fontSize: hp(3.5),
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
    flexDirection: "row",
    marginTop:hp(5)
  },
  TextInput: {
    flex: 1,
    padding: hp(1.5),
    "color": "#000",
    fontWeight: "bold",
    fontSize: hp(2.1),
    marginLeft: wp(2)
  },
  confirmBtn: {
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
  icon: {
    fontSize: hp(4),
    color: "orange"
  },
  confirmtext: {
    color: "#000",
    fontSize: hp(3),
    height: hp(5),
    fontWeight: "500",
    marginTop: hp(8.5),
    marginLeft: wp(46.5)
  }
});
import React, { useState ,useContext } from "react";
import tw from 'twrnc';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";
import Icon1 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/AntDesign';

const User = () => {
  const navigation=useNavigation();
  const [fdata, setFdata] = useState({
    email: "",
    password: ""
  })
  const { setuserid } = useContext(AuthContext);
  const [errormsg, setErrorMsg] = useState(null);

  const sendToBackend = async () => {
    if ((fdata.email == "") || (fdata.password == "")) {
      setErrorMsg("All fields are required")
    }
    else {
      fetch('http://192.168.184.156:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fdata)
      })
        .then(res => res.json()).then(
          async(data) => {
            if (data.error) {
              setErrorMsg(data.error);
            }
            else {
              setuserid(data.uid.q);
              navigation.navigate('UserDetails');
            }
          }
        )
    }
  }
  return (

    <View style={{ flex: 1, alignContent:"center",backgroundColor: '#F5FCFF'}}>
        <Text style={styles.signinText}>SIGN IN</Text>
        <View style={styles.inputView}>
          <Icon2
            name="user"
            size={hp(3)}
            color="black"
            style={{ marginTop:hp(1.2),marginLeft:wp(5)}}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="User ID"
            placeholderTextColor="#000"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, email: text })}
          />
        </View>
        <View style={styles.inputView}>
          <Icon2
            name="lock"
            size={hp(3)}
            color="black"
            style={{ marginTop:hp(1.2),marginLeft:wp(5)}}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#000"
            secureTextEntry={true}
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, password: text })}
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot_button}
            onPress={() => {
              navigation.navigate('ForgotPassword')
            }}
          >Forgot Password?</Text>
        </TouchableOpacity>
        <View>
          {
            errormsg ? <Text style={{ "color": "red",marginLeft:wp(30),marginTop:hp(2) }}>{errormsg}</Text> : null
          }
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.signintext}>Sign in</Text>
          <TouchableOpacity style={styles.loginBtn}>
            <Icon1 style={styles.icon} name="arrow-forward-outline" onPress={() => sendToBackend()} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row',marginTop:hp(9) }}>
          <Text style={styles.userText}>New User?</Text>
          <TouchableOpacity>
            <Text style={styles.signup_button} onPress={() =>
              navigation.navigate('Signup')}>Create</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  signinText:
  {
    marginLeft: wp(32),
    marginTop: hp(25),
    marginBottom: hp(8),
    fontSize: hp(5),
    fontWeight: "500",
    color:"orange"
  },
  userText:
  {
    height: hp(5),
    fontSize: hp(2.2),
    marginLeft: hp(14.5),
    fontWeight: "500",
    color: "#000"
  },
  inputView: {
    backgroundColor: "#fff",
    borderRadius: hp(3),
    width: wp(80),
    height: hp(6),
    marginLeft: wp(10),
    elevation:10,
    marginBottom: hp(4),
    borderColor: 'orange',
    borderWidth: hp(0.2),
    flexDirection:"row"
  },
  TextInput: {
    flex: 1,
    padding: hp(1.5),
    "color": "#000",
    fontWeight: "bold",
    fontSize: hp(2.1),
  },
  forgot_button: {
    marginLeft: hp(24),
    color: "orange",
    fontSize: hp(2.2),
    fontWeight: "500",
  },
  signup_button:
  {
    fontSize: hp(2.2),
    color: "orange",
    fontWeight: "500",
    marginLeft: wp(2)
  },
  loginBtn: {
    width: hp(8),
    borderRadius: hp(3),
    height: hp(5.5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(8),
    marginLeft:wp(1.5),
    backgroundColor: "#fff",
    elevation:10,
    borderColor: 'orange',
    borderWidth: hp(0.2),
  },
  icon: {
    fontSize: hp(4),
    color: "orange"
  },
  signintext:{
    color: "#000",
    fontSize: hp(3),
    height:hp(5),
    fontWeight: "500",
    marginTop:hp(8.5),
    marginLeft:wp(50.5)
  }
})

export default User;
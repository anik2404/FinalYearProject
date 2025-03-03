import React, { useState ,useContext } from "react";
import tw from 'twrnc';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from "@react-navigation/native";

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
      fetch('http://192.168.104.156:3000/user/login', {
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
              navigation.navigate('UserDetails',{userid:data.uid.q})
            }
          }
        )
    }
  }
  return (

    <View style={{ flex: 1, backgroundColor: '#F5FCFF' }}>
      <View style={styles.container1}>
        <Image style={tw`w-full h-full`} source={require("./pic.jpg")} />
      </View>

      <View style={styles.container}>
        <Text style={styles.signinText}>SIGN IN</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="User ID"
            placeholderTextColor="#003f5c"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, email: text })}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
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
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}
            onPress={() => {
              sendToBackend();
            }
            }>LOGIN</Text>
        </TouchableOpacity>
        <View style={{ margin: 20, flexDirection: 'row' }}>
          <Text style={styles.userText}>New User?</Text>
          <TouchableOpacity>
            <Text style={styles.signup_button} onPress={() =>
              navigation.navigate('Signup')}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View>
          {
            errormsg ? <Text style={{ "color": "red" }}>{errormsg}</Text> : null
          }
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#312e81",
    height: '66.666667%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  container1: {
    flex: 1,
    backgroundColor: "#fff",
    height: '33.333333%'
  },
  signinText:
  {
    height: 40,
    marginLeft: 135,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 32,
    fontWeight: "bold",
    "color": "#fff"
  },
  userText:
  {
    height: 20,
    fontSize: 16,
    marginLeft: 90,
    fontWeight: "bold",
    "color": "#fff"
  },
  inputView: {
    backgroundColor: "#C2FEFE",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginLeft: 55,
    marginBottom: 20,
  },
  TextInput: {
    flex: 1,
    padding: 10,
    "color": "#312e81",
    fontWeight: "bold",
    marginLeft: 20,
    fontSize: 16,
  },
  forgot_button: {
    height: 30,
    marginLeft: 130,
    "color": "#38bdf8",
    fontSize: 16,
    fontWeight: "bold",
  },
  signup_button:
  {
    fontSize: 16,
    "color": "#38bdf8",
    fontWeight: "bold",
    marginLeft: 10
  },
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
  loginText:
  {
    fontSize: 20,
    "color": "#77F3F7",
    fontWeight: "bold"
  },
  imageStyle: {
    padding: 10,
    marginLeft: 20,
    marginTop: 10,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  }
})

export default User;
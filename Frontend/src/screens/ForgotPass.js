import React, { useState } from "react";
import tw from 'twrnc';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ForgotPass=()=>{
  const navigation=useNavigation()
  const [fdata, setFdata] = useState({
    reemail: "",
  })
  const [errormsg, setErrorMsg] = useState(null);
  const sendToBackend = () => {
    if ((fdata.reemail == "")) {
      setErrorMsg("All fields are required")
    }
    else {
      fetch('http://192.168.0.111:3000/user/forgotpass', {
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
              q=data.p
              navigation.navigate('ResetPassword',{id:q})
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
        <Text style={styles.signinText}>FORGOT PASSWORD</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Enter your registered email"
            placeholderTextColor="#003f5c"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, reemail: text })}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}
            onPress={() => {
              sendToBackend();
            }}
          >
            Confirm</Text>
        </TouchableOpacity>
        <View>
          {
            errormsg ? <Text style={{ "color": "red" }}>{errormsg}</Text> : null
          }
        </View>
      </View>
    </View>

  );
}
export default ForgotPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#312e81",
    height: '33.333333%'
  },
  container1: {
    flex: 1,
    backgroundColor: "#fff",
    height: '66.666667%'
  },
  signinText:
  {
    height: 40,
    marginLeft: 80,
    marginTop: 40,
    marginBottom: 50,
    fontSize: 28,
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
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    "color": "#312e81",
    fontWeight: "bold",
    fontSize: 16
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
});
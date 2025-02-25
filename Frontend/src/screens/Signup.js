import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';
export default function Signup({ navigation }) {

  const [fdata, setFdata] = useState({
    name: "",
    email: "",
    dob: "",
    grade: "",
    password: "",
  })
  const [errormsg, setErrorMsg] = useState(null);

  const sendToBackend = () => {
    if ((fdata.name == "") || (fdata.email == "") || (fdata.dob == "") || (fdata.grade == "") ||  (fdata.password == "") || (fdata.conpsswd == "")) {
      setErrorMsg("All fields are required")
    }
    else if (fdata.conpsswd != fdata.password) {
      setErrorMsg("Confirm password not matched")
    }
    else {
      fetch('http://192.168.0.106:3000/user/register', {
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
              alert('Account created succesfully');
              navigation.navigate('UserMain');
            }
          }
        )
    }
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headingText1}>Please fill up the details to</Text>
        <Text style={styles.headingText2}>complete your account</Text>
        <View>
          {
            errormsg ? <Text style={{ marginLeft: 50, "color": "red" }}>{errormsg}</Text> : null
          }
        </View>
        <View style={styles.inputView}>
          <Icon1
            name="user"
            size={30}
            color="black"
            style={{ marginTop: 10}}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Name*"
            placeholderTextColor="#003f5c"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, name: text })}
          />
        </View>

        <View style={styles.inputView}>
        <Icon
            name="email"
            size={30}
            color="black"
            style={{ marginTop: 10}}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Email ID*"
            placeholderTextColor="#003f5c"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, email: text })}
          />
        </View>
        <View style={styles.inputView}>
        <Icon1
            name="calendar"
            size={30}
            color="black"
            style={{ marginTop: 10}}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="DD/MM/YYYY (Date of Birth*)"
            placeholderTextColor="#003f5c"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, dob: text })}
          />
        </View>
        <View style={styles.inputView}>
        <Icon2
            name="graduation-cap"
            size={30}
            color="black"
            style={{ marginTop: 10}}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Select Grade/Course*"
            placeholderTextColor="#003f5c"
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, grade: text })}
          />
        </View>
        <View style={styles.inputView}>
        <Icon1
            name="lock"
            size={30}
            color="black"
            style={{ marginTop: 10}}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Set Password*"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, password: text })}
          />
        </View>
        <View style={styles.inputView}>
        <Icon1
            name="lock"
            size={30}
            color="black"
            style={{ marginTop: 10}}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Confirm Password*"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onPressIn={() => setErrorMsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, conpsswd: text })}
          />
        </View>
        <TouchableOpacity style={styles.signupBtn}>
          <Text style={styles.signupText1}
            onPress={() => {
              sendToBackend();
            }
            }
          >SIGN UP</Text>
        </TouchableOpacity>
        <View style={{ margin: 20, flexDirection: 'row' }}>
          <Text style={styles.userText}>Already a user?</Text>
          <TouchableOpacity>
            <Text style={styles.signin_button} onPress={() =>
              navigation.navigate('login')}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headingText1:
  {
    height: 30,
    marginLeft: 80,
    marginTop: 90,
    fontSize: 20,
    fontWeight: "bold",
    "color": "#0F40D8"
  },
  headingText2:
  {
    height: 40,
    marginLeft: 95,
    marginBottom: 80,
    fontSize: 20,
    fontWeight: "bold",
    "color": "#0F40D8"
  },
  inputView: {
    "borderColor": "#312e81",
    borderBottomWidth: 2,
    width: "80%",
    height: 45,
    marginLeft: 40,
    marginBottom: 20,
    flexDirection: 'row'
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    "color": "#312e81",
    fontSize: 16,
    marginLeft: 10
  },
  signupBtn: {
    width: "30%",
    borderRadius: 10,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginLeft: 135,
    backgroundColor: "#0F40D8",
  },
  signupText1:
  {
    fontSize: 16,
    fontWeight: "bold",
    "color": "#fff"
  },
  userText:
  {
    height: 20,
    fontSize: 16,
    marginLeft: 80,
    fontWeight: "bold",
    "color": "#000"
  },
  signin_button:
  {
    fontSize: 16,
    "color": "#38bdf8",
    fontWeight: "bold",
    marginLeft: 10
  },
  imageStyle: {
    padding: 10,
    marginLeft: 5,
    marginTop: 10,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  }
});
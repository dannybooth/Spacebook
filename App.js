import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import LogoutScreen from './screens/Logout';
import MyProfile from './screens/MyProfile';
import FindFriend from './screens/FindFriend';
import ProfileScreen from './screens/Profile';
import UpdateProfileScreen from './screens/UpdateProfile';
import UpdateProfilePicScreen from './screens/UpdateMyProfilePic';
import Post from './screens/Post';

const Drawer = createDrawerNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="MyProfile">
          <Drawer.Screen name="MyProfile" component={MyProfile} />
          <Drawer.Screen name="FindFriends" component={FindFriend} />
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Signup" component={SignupScreen} />
          <Drawer.Screen name="Logout" component={LogoutScreen} />
          <Drawer.Screen name="Profile" options={{ drawerItemStyle: { display: 'none' } }} component={ProfileScreen} />
          <Drawer.Screen name="UpdateProfile" options={{ drawerItemStyle: { display: 'none' } }} component={UpdateProfileScreen} />
          <Drawer.Screen name="UpdateProfilePicScreen" options={{ drawerItemStyle: { display: 'none' } }} component={UpdateProfilePicScreen} />
		  <Drawer.Screen name="Post" options={{ drawerItemStyle: { display: 'none' } }} component={Post} />
        </Drawer.Navigator>

      </NavigationContainer>
    );
  }
}

export default App;

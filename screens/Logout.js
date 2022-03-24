import React, { Component } from 'react';
import { Text, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value !== null) {
      this.setState({ token: value });
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  logout = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <ScrollView>
        <Text style={{
          fontSize: 18, fontWeight: 'bold', padding: 5, margin: 5,
        }}
        >
          Do you really want to logout?
        </Text>
        <Button
          title="Logout"
          onPress={() => this.logout()}
        />
        <Button
          title="Back"
          color="darkblue"
          onPress={() => this.props.navigation.navigate('MyProfile')}
        />
      </ScrollView>
    );
  }
}

export default HomeScreen;

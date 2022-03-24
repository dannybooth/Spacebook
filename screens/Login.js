import React, { Component } from 'react';
import { Button, Text } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.checkLoggedIn();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  login = async () =>

    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          this.setState({ error: 'Invalid email or password' });
          throw this.state.error;
        } else {
          this.setState({ error: 'Something went wrong' });
          throw this.state.error;
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        await AsyncStorage.setItem('@id', responseJson.id);
        this.props.navigation.navigate('MyProfile');
      })
      .catch((error) => {
        console.log(error);
      });

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value != null) {
      this.props.navigation.navigate('MyProfile');
    }
  };

  render() {
    return (
      <ScrollView>
        <TextInput
          placeholder="Enter your email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button
          title="Login"
          onPress={() => this.login()}
        />
        <Button
          title="Don't have an account?"
          color="darkblue"
          onPress={() => this.props.navigation.navigate('Signup')}
        />
        <Text>
          {this.state.error}
          {' '}
        </Text>
      </ScrollView>
    );
  }
}

export default LoginScreen;

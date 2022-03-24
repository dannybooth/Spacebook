import React, { Component } from 'react';
import {
  Button, ScrollView, TextInput, Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      error: '',
    };
  }

  signup = () =>
  // Validation here...
    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 400) {
          if (this.state.password.length <= 5) {
            this.setState({ error: 'Password should be greater than 5 characters long' });
            throw 'Password should be greater than 5 characters long';
          } else if (!this.state.email.includes('@')) {
            this.setState({ error: 'Email is an invalid email' });
            throw 'Email is an invalid email';
          } else {
            this.setState({ error: 'Email has already been used' });
            throw 'Email has already been used';
          }
        } else {
          this.setState({ error: 'Something went wrong' });
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log('User created with ID: ', responseJson);
        this.props.navigation.navigate('Login');
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

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.checkLoggedIn();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <ScrollView>
        <TextInput
          placeholder="Enter your first name..."
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your last name..."
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
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
          title="Create an account"
          onPress={() => this.signup()}
        />
        <Text>{this.state.error}</Text>
      </ScrollView>
    );
  }
}

export default SignupScreen;

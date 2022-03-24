import React, { Component } from 'react';
import {
  View, Text, TextInput, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      user: null,
      photo: null,
      error: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getuser();
    });
    this.checkLoggedIn();
    this.getuser();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getuser = async () => {
    // Validation here...
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw 'Failed validation';
        } else if (response.status === 401) {
          this.setState({ error: 'Unauthorised' });
          throw 'Unauthorised';
        } else if (response.status === 404) {
          this.setState({ error: 'Not Found' });
          throw 'Not Found';
        } else if (response.status === 500) {
          this.setState({ error: 'Server Error' });
          throw 'Server Error';
        } else {
          this.setState({ error: 'Something went wrong' });
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          user: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  updateprofile = async () => {
    // Validation here...
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        if (response.status === 200) {
          this.getuser();
        } else if (response.status === 400) {
          if (this.state.password.length <= 5) {
            this.setState({ error: 'Password needs to be greater than 5 characters' });
            throw 'Password needs to be greater than 5 characters';
          } else if (!this.state.email.includes('@')) {
            this.setState({ error: 'Email is an invalid email' });
            throw 'Email is an invalid email';
          } else {
            this.setState({ error: 'Email has already been used' });
            throw 'Email has already been used';
          }
        } else if (response.status === 401) {
          this.setState({ error: 'Unauthorised' });
          throw 'Unauthorised';
        } else if (response.status === 403) {
          this.setState({ error: 'Forbidden' });
          throw 'Forbidden';
        } else if (response.status === 404) {
          this.setState({ error: 'Not Found' });
          throw 'Not Found';
        } else if (response.status === 500) {
          this.setState({ error: 'Server Error' });
          throw 'Server Error';
        } else {
          this.setState({ error: 'Something went wrong' });
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log('User updated with ID: ', responseJson);
        this.props.navigation.navigate('MyProfile');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
			  flex: 1,
			  flexDirection: 'column',
			  justifyContent: 'center',
			  alignItems: 'center',
          }}
        >
          <Text>Loading..</Text>
          <Text>{this.state.error}</Text>
        </View>
      );
	  }
    return (
      <View>
        <Button
          title="Cancel"
          onPress={() => this.props.navigation.goBack()}
        />
        <TextInput
          placeholder="Enter your new first name..."
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your new last name..."
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your new email..."
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <TextInput
          placeholder="Enter your new password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          secureTextEntry
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button
          title="Update"
          onPress={() => this.updateprofile()}
        />
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

export default UpdateProfileScreen;

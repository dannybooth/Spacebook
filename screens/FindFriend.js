import React, { Component } from 'react';
import {
  View, Text, FlatList, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FindFriends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      error: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getData();
      this.getuser();
    });
    this.checkLoggedIn();
    this.getData();
    this.getuser();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/search', {
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.props.navigation.navigate('Login');
          this.setState({ error: 'Unauthorised' });
          throw this.state.error;
        } else {
          this.setState({ error: 'Something went wrong' });
          throw this.state.error;
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          listData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          throw this.state.error;
        } else if (response.status === 404) {
          this.setState({ error: 'Not found' });
          throw this.state.error;
        } else {
          this.setState({ error: 'Something went wrong' });
          throw this.state.error;
        }
      })
      .then((responseJson) => {
        console.log('User with the ID: ', responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addfriend = async (valueid) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/friends`, {
      method: 'post',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 201) {
          console.log(`User sent friend request to a user with the ID: ${valueid}`);
        } else if (response.status === 401) {
          this.setState({ error: 'Unauthorised' });
          throw this.state.error;
        } else if (response.status === 403) {
          this.setState({ error: 'User already added' });
          throw this.state.error;
        } else if (response.status === 404) {
          this.setState({ error: 'Not Found' });
          throw this.state.error;
        } else if (response.status === 500) {
          this.setState({ error: 'Server Error' });
          throw this.state.error;
        } else {
          this.setState({ error: 'Something went wrong' });
          throw this.state.error;
        }
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
        <FlatList
          data={this.state.listData}
          renderItem={({ item }) => (
            <View>
              <Text>
                {item.user_givenname}
                {' '}
                {item.user_familyname}
                {' '}
              </Text>
              <Button
                title="View profile"
                onPress={() => this.props.navigation.navigate('Profile', { user_id: item.user_id })}
              />
              <Button
                title="Send Friend Request"
                onPress={() => this.addfriend(item.user_id)}
              />
              <Text>
                {' '}
                {'\n'}
                {' '}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
      </View>
    );
  }
}

export default FindFriends;

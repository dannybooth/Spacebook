import React, { Component } from 'react';
import {
  StyleSheet, View, Text, TextInput, Button, FlatList, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'center',
  },
});

class MyProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      user: null,
      photo: null,
      text: '',
      editedtext: '',
      getFriendsList: [],
      posts: [],
      getFriendReqts: [],
      drafts: [],
      error: '',
	  user_id: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getuser();
      this.searchposts();
      this.myfriendrequests();
      this.searchfriends();
      this.get_profile_image();
    });
    this.getuser();
    this.searchposts();
    this.myfriendrequests();
    this.searchfriends();
    this.get_profile_image();
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
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Unauthorised' });
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
      .then((responseJson) => {
        this.setState({
          isLoading: false,
		  user_id: valueid,
          user: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  myfriendrequests = async () => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');

    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
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
        } else if (response.status === 401) {
          this.setState({ error: 'Unauthorised' });
          throw this.state.error;
        } else if (response.status === 500) {
          this.setState({ error: 'Server Error' });
          throw this.state.error;
        } else {
          this.setState({ error: 'Something went wrong' });
          throw this.state.error;
        }
      })
      .then((responseJson) => {
        this.setState({
          getFriendReqts: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  acceptfriendrequest = async (valueid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${valueid}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(`User added with the id of: ${valueid}`);
        } else if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
          throw this.state.error;
        } else if (response.status === 500) {
          this.setState({ error: 'Server Error' });
          throw this.state.error;
        } else {
          this.setState({ error: 'Something went wrong' });
          throw this.state.error;
        }
      })
      .then(() => {
        this.myfriendrequests();
        this.searchfriends();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  rejectfriendrequest = async (valueid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${valueid}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(`User declined with the id of: ${valueid}`);
        } else if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
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
      .then(() => {
        this.myfriendrequests();
        this.searchfriends();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchfriends = async () => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');

    return fetch('http://localhost:3333/api/1.0.0/search?search_in=friends', {
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
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
          throw this.state.error;
        } else if (response.status === 403) {
          this.setState({ error: 'Can only view yourself and friends' });
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
      .then((responseJson) => {
        this.setState({
          getFriendsList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchposts = async () => {
    // Validation here...
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post`, {
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
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
          throw this.state.error;
        } else if (response.status === 403) {
          this.setState({ error: 'Can only view yourself and friends' });
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
      .then((responseJson) => {
        this.setState({
          posts: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  sendpost = async () => {
    const mypost = {
      text: this.state.text,
    };

    // Validation here...
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
      body: JSON.stringify(mypost),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
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
      .then((responseJson) => {
        this.searchposts();
        console.log('Post posted with ID: ', responseJson, 'with the text:', mypost.text);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deletepost = async (postid) => {
    // Validation here...
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post/${postid}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response;
        } if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
          throw this.state.error;
        } else if (response.status === 403) {
          this.setState({ error: 'Can only delete your own posts' });
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
      .then((responseJson) => {
        this.searchposts();
        console.log('Deleted post with id:', postid, responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editpost = async (postid, edited) => {
    const myedit = {
      text: edited,
    };

    // Validation here...
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post/${postid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
      body: JSON.stringify(myedit),
    })
      .then((response) => {
        if (response.status === 200) {
          return response;
        } if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
          throw this.state.error;
        } else if (response.status === 403) {
          this.setState({ error: 'Can only edit your own posts' });
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
      .then(() => {
        this.searchposts();
        console.log('Edited post with ID:', `${+postid} to have the text:`, edited);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  get_profile_image = async () => {
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');
    fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response;
        } if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
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
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  draftpost = async () => {
    const mypost = {
      text: this.state.drafts,
    };

    // Validation here...
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
      body: JSON.stringify(mypost),
    })
      .then((response) => {
        if (response.status === 200) {
          return response;
        } if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
          throw this.state.error;
        } else if (response.status === 403) {
          this.setState({ error: 'Can only edit your own posts' });
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
      .then((responseJson) => {
        this.searchposts();
        console.log('Post drafted with ID: ', responseJson, 'with the text:', mypost.text);
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
      <View style={styles.container}>
        <Image
          source={{
            uri: this.state.photo,
          }}
          style={{
            width: 100,
            height: 100,
            borderWidth: 5,
          }}
        />
        <Button
          title="Update profile picture"
          onPress={() => this.props.navigation.navigate('UpdateProfilePicScreen')}
          
        />
        <Text>
          First name:
          {this.state.user.first_name}
        </Text>
        <Text>
          Last name:
          {this.state.user.last_name}
        </Text>
        <Text>
          Email:
          {this.state.user.email}
        </Text>
        <Button
          title="Update profile"
          onPress={() => this.props.navigation.navigate('UpdateProfile')}
        />
        <Text>
          Number of Friends:
          {this.state.user.friend_count}
        </Text>
        <Text>
          {' '}
          {'\n'}
          {' '}
        </Text>
        <TextInput
          placeholder="Create post..."
          onChangeText={(text) => this.setState({ text })}
          style={{ padding: 5, borderWidth: 1, margin: 5 }}
        />
        <Button
          title="Send"
          onPress={() => this.sendpost()}
        />
        <Button
          title="Draft"
          onPress={() => this.draftpost()}
        />

        <Text style={{ fontWeight: 'Bold' }}>
          {'\n'}
          Drafts
        </Text>
        <FlatList
          data={this.state.drafts}
          renderItem={({ item }) => (
            <View>

              <Text>
                {item.text}
                {' '}
                {'\n'}
              </Text>
              <TextInput
                placeholder="Edit Post..."
                onChangeText={(editedtext) => this.setState({ editedtext })}
                style={{ padding: 5, borderWidth: 1, margin: 5 }}
              />
              <Button
                title="Edit"
                onPress={() => this.editpost(item.post_id, this.state.editedtext)}
              />
              <Button
                title="Delete"
                onPress={() => this.deletepost(item.post_id)}
              />
              <Text>
                Likes:
                {item.numLikes}
              </Text>
              <Text>{item.timestamp}</Text>
              <Text>{'\n'}</Text>
              <Text>{'\n'}</Text>
            </View>

          )}
          keyExtractor={(item) => item.post_id.toString()}
        />

        <Text style={{ fontWeight: 'Bold' }}>
          {'\n'}
          Posts
        </Text>
        <FlatList
          data={this.state.posts}
          renderItem={({ item }) => (
            <View>

              <Text>
                {item.text}
                {' '}
                {'\n'}
              </Text>
              <TextInput
                placeholder="Edit Post..."
                onChangeText={(editedText) => this.setState({ editedText })}
                style={{ padding: 5, borderWidth: 1, margin: 5 }}
              />
              <Button
                title="Edit"
                onPress={() => this.editpost(item.post_id, this.state.editedText)}
              />
              <Button
                title="Delete"
                onPress={() => this.deletepost(item.post_id)}
              />
			  <Button
                title="View Post"
                onPress={() => this.props.navigation.navigate('Post', { post_id: item.post_id, user_id: this.state.user_id })}
              />
              <Text>
                Likes:
                {item.numLikes}
              </Text>
              <Text>{item.timestamp}</Text>
              <Text>{'\n'}</Text>
              <Text>{'\n'}</Text>
            </View>

          )}
          keyExtractor={(item) => item.post_id.toString()}
        />

        <Text style={{ fontWeight: 'Bold' }}>
          {'\n'}
          Friends
        </Text>
        <FlatList
          data={this.state.getFriendsList}
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
              <Text>
                {' '}
                {'\n'}
                {' '}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />

        <Text style={{ fontWeight: 'Bold' }}>
          {'\n'}
          Friend requests
        </Text>
        <FlatList
          data={this.state.getFriendReqts}
          renderItem={({ item }) => (
            <View>

              <Text>
                {item.first_name}
                {' '}
                {item.last_name}
                {' '}
                {'\n'}
              </Text>
              <Button
                title="Add friend"
                onPress={() => this.acceptfriendrequest(item.user_id)}
              />

              <Button
                title="Reject friend"
                onPress={() => this.rejectfriendrequest(item.user_id)}
              />
            </View>

          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
      </View>
    );
  }
}

export default MyProfileScreen;

import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Button, FlatList, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      user: null,
      friendError: '',
      postError: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      const { user_id } = this.props.route.params;
      this.getuser(user_id);
      this.searchposts(user_id);
      this.get_profile_image(user_id);
      this.setState({ friendError: '' });
      this.setState({ postError: '' });
    });
    const { user_id } = this.props.route.params;

    this.getuser(user_id);
    this.searchposts(user_id);
    this.get_profile_image(user_id);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getuser = async (userid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${userid}`, {
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
          throw 'Failed validation';
        } else {
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

  searchposts = async (valueid) => {
    // Validation here...
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
          this.setState({ postError: 'Failed validation' });
          return null;
        } if (response.status === 401) {
          this.setState({ postError: 'Unauthorised' });
          return null;
        } if (response.status === 403) {
          this.setState({ postError: 'Cannot load posts since you can only view posts of yourself and friends posts' });
          return this.postError;
        } if (response.status === 404) {
          this.setState({ postError: 'Posts not found' });
          return null;
        } if (response.status === 500) {
          this.setState({ postError: 'Server Error' });
          return null;
        }
        this.setState({ postError: 'Something went wrong' });
        return null;
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
  
  searchpost = async (postid) => {
    // Validation here...
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post/${postid}`, {
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
          post: responseJson,
        });
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
          throw 'Unauthorised';
        } else if (response.status === 403) {
          this.setState({ friendError: 'User already added' });
          throw 'User already added';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  likepost = async (postid, valueid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post/${postid}/like`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
        } else if (response.status === 400) {
          this.unlikepost(postid, valueid);
          throw 'Failed validation';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          this.unlikepost(postid, valueid);
          throw 'You have already liked this post';
        } else if (response.status === 404) {
          throw 'post not found';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(() => {
        this.searchposts(valueid);
        console.log('Liked posted with ID: ', postid);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  unlikepost = async (postid, valueid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post/${postid}/like`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
        } else if (response.status === 400) {
          throw 'Failed validation';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'You have not liked this post';
        } else if (response.status === 404) {
          throw 'post not found';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(() => {
        this.searchposts(valueid);
        console.log('Unliked posted with ID: ', postid);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  get_profile_image = async (valueid) => {
    const value = await AsyncStorage.getItem('@session_token');
    fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((res) => res.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    if (this.state.isLoading) {
      return (<View><Text>Loading...</Text></View>);
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
          title="Back"
          onPress={() => this.props.navigation.goBack()}
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
        <Text>
          Number of Friends:
          {this.state.user.friend_count}
        </Text>
        <Button
          title="Send Friend Request"
          onPress={() => this.addfriend(this.state.user.user_id)}
        />
        <Text>
          {this.state.friendError}
          {' '}
        </Text>
        <Text style={{ fontWeight: 'Bold' }}>
          {'\n'}
          Posts
        </Text>
        <Text>
          {this.state.postError}
          {' '}
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
			  <Button
                title="View Post"
                onPress={() => this.props.navigation.navigate('Post', { post_id: item.post_id, user_id : this.state.user.user_id })}
              />
              <Button
                title="Like"
                onPress={() => this.likepost(item.post_id, this.state.user.user_id)}
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
      </View>
    );
  }
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'center',
  },
});

import { gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

const SEARCH_USER = gql`
query SearchUser($username: String) {
  searchUser(username: $username) {
    _id
    name
    username
    email
    follower {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
    followerDetail {
      _id
      name
      username
    }
    following {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
    followingDetail {
      _id
      name
      username
    }
  }
}
`;

const FOLLOW_USER = gql`
mutation Following($id: String) {
  following(_id: $id)
}
`;

const SearchScreen = ({ navigation }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchUser, { data, loading, error }] = useLazyQuery(SEARCH_USER);
    const [followUser] = useMutation(FOLLOW_USER);
    const [followedUsers, setFollowedUsers] = useState({});

    const handleSearch = (text) => {
        setSearchTerm(text);
        if (text.trim() === '') {
            return;
        }
        searchUser({ variables: { username: text } });
    };

    const handleFollowToggle = async (userId) => {
        try {
            const currentUserId = 'currentUserId';
            console.log(userId, "<<<USERID");
            const result = await followUser({
                variables: {
                    id: userId,
                },
            });
            setFollowedUsers(prev => ({ ...prev, [userId]: true }));

            console.log('Follow result:', result.data.followUser);

            Alert.alert('Success', `Followed user ${userId}`);
        } catch (error) {
            console.log('Error following user:', error.message);
            Alert.alert('Error', `Failed to follow user ${userId}`);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) {
        console.error('Error fetching users:', error.message);
        return <Text>Error: {error.message}</Text>;
    }

    const users = data?.searchUser || [];

    const renderUser = ({ item }) => (
        <View style={styles.userItem}>
            <Text style={styles.username}>{item.username}</Text>
            <TouchableOpacity
                style={[styles.followButton, followedUsers[item._id] ? styles.followedButton : {}]}
                onPress={() => {
                    if (!followedUsers[item._id]) {
                        handleFollowToggle(item._id);
                    }
                }}
                disabled={followedUsers[item._id]}
            >
                <Text style={styles.followButtonText}>
                    {followedUsers[item._id] ? 'Followed' : 'Follow'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                value={searchTerm}
                onChangeText={handleSearch}
            />
            <FlatList
                data={users}
                keyExtractor={item => item._id}
                renderItem={renderUser}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
    },
    username: {
        fontSize: 18,
    },
    followButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    followButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    followedButton: {
        backgroundColor: '#cccccc',
    },
    followButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default SearchScreen;

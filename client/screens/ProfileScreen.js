import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';
import { AuthContext } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

// Query untuk mengambil profil pengguna
const GET_PROFILE = gql`
query UserById($id: ID!) {
  userById(_id: $id) {
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
    following {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
}
`;

const ProfileScreen = () => {
    const { setIsSignedIn, userId } = useContext(AuthContext);


    const { data, loading, error } = useQuery(GET_PROFILE, {
        variables: { id: userId }, fetchPolicy: "no-cache",
    });


    const user = data?.userById || {};


    if (!userId) {
        return <Text>No user ID available. Please log in.</Text>;
    }
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) {
        console.error('Error fetching profile:', error.message);
        Alert.alert('Error', 'Failed to fetch profile');
        return <Text>Error: {error.message}</Text>;
    }
    return (
        <View style={styles.container}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <View style={styles.statsContainer}>
                <TouchableOpacity style={styles.statItem}>
                    <Text style={styles.statNumber}>{user.follower.length}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem}>
                    <Text style={styles.statNumber}>{user.following.length}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={async () => {
                    await SecureStore.deleteItemAsync('access_token');
                    setIsSignedIn(false);
                }}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    username: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;

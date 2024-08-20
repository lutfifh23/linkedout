import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PostCard from '../components/Card';
import { gql, useQuery } from '@apollo/client';

const GET_POSTS = gql`
query Posts {
  posts {
    _id
    content
    tags
    imgUrl
    authorId
    author {
      username
      email
      _id
    }
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`

const SocialMediaFeed = ({ navigation }) => {
    console.log("HOmePage", new Date());
    const { data, loading, error, refetch } = useQuery(GET_POSTS, { fetchPolicy: "no-cache", });

    const handleCommentPress = (post) => {
        navigation.navigate('PostDetail', { post });
    };

    const handleSearchPress = () => {
        navigation.navigate('Search');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Time';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    };

    const renderItem = ({ item }) => {
        return (
            <PostCard
                postId={item._id}
                username={item.author ? item.author.username : 'Unknown User'}
                time={formatDate(item.createdAt)}
                text={item.content || 'No content'}
                image={item.imgUrl || ''}
                likes={item.likes || []}
                comments={item.comments || []}
                onCommentPress={() => handleCommentPress(item)}
                refetch={refetch}
            />
        );
    };
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Feed</Text>
                <TouchableOpacity onPress={handleSearchPress}>
                    <Ionicons name="search" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={data?.posts || []}
                renderItem={renderItem}
                keyExtractor={item => item._id.toString()}
                contentContainerStyle={{ padding: 15 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        elevation: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default SocialMediaFeed;

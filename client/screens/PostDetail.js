import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { gql, useMutation, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs-ext/plugin/relativeTime'

dayjs.extend(relativeTime)

const GET_POST_BY_ID = gql`
query PostsById($id: ID) {
  postsById(_id: $id) {
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

const POST_COMMENT = gql`
mutation AddComment($content: String, $postsId: String) {
  addComment(content: $content, postsId: $postsId)
}
`

const PostDetailScreen = ({ navigation }) => {
    const route = useRoute();
    const { post } = route.params;
    const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
        variables: {
            id: post._id
        }
    })
    const [content, setContent] = useState('');
    const [doComments] = useMutation(POST_COMMENT)

    const handleAddComment = async () => {
        if (content.trim() === '') {
            Alert.alert('Error', 'Comment cannot be empty');
            return;
        }
        const postId = post._id;
        if (typeof postId !== 'string' || postId.length !== 24) {
            Alert.alert('Error', 'Invalid post ID');
            return;
        }
        try {
            const result = await doComments({
                variables: {
                    content: content,
                    postsId: post._id
                }
            })
                (result, "<<<INI APA");

            setContent('');
            refetch()
            Keyboard.dismiss()
        } catch (error) {
            if (error) return <Text>Error: {error.message}</Text>;
        }
    };
    if (loading) return <Text>Loading...</Text>;

    const currentPost = data ? data.postsById : post;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Post Details</Text>
            </View>
            <Text style={styles.content}>{currentPost.content}</Text>
            {currentPost.imgUrl ? <Image source={{ uri: currentPost.imgUrl }} style={styles.image} /> : null}
            <Text style={styles.info}>Likes: {currentPost.likes?.length}</Text>
            <Text style={styles.info}>Comments: {currentPost.comments?.length}</Text>

            <FlatList
                data={currentPost.comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.comment}>
                        <Text style={styles.commentUser}>{item.username}</Text>
                        <Text style={styles.commentText}>{item.content}</Text>
                        <Text style={styles.commentTime}>{dayjs(item.createdAt).fromNow()}</Text>
                    </View>
                )}
                ListHeaderComponent={() => <Text style={styles.sectionTitle}>Comments</Text>}
            />

            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={content}
                    onChangeText={setContent}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        fontSize: 16,
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    comment: {
        marginBottom: 10,
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 16,
    },
    commentTime: {
        fontSize: 12,
        color: '#666',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    commentInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#F2613F',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    addButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default PostDetailScreen;

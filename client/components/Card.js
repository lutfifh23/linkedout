import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { gql, useMutation } from '@apollo/client';

const ADD_LIKE = gql`
mutation AddLike($postsId: String) {
  addLike(postsId: $postsId)
}
`;

const PostCard = ({ username, time, text, image, likes, comments, postId, onCommentPress, refetch }) => {
    const [liked, setLiked] = useState(false);
    const [doLike, { loading, error }] = useMutation(ADD_LIKE);

    const safeLikes = Array.isArray(likes) ? likes : [];
    const safeComments = Array.isArray(comments) ? comments : [];

    useEffect(() => {
        const userId = 'currentUserId';
        setLiked(safeLikes.some(like => like.userId === userId));
    }, [likes]);

    const handleLikePress = useCallback(async () => {
        try {

            if (!postId) {
                console.warn("Post ID is not available.");
                return;
            }
            await doLike({ variables: { postsId: postId } });

            if (refetch) {
                refetch();
            }
        } catch (err) {
            console.error("Error adding like:", err.message);
            Alert.alert("Error", "Failed to add like");
        }
    }, [doLike, postId, refetch]);

    const handleCommentPress = () => {
        if (onCommentPress) {
            onCommentPress();
        } else {
            console.warn("onCommentPress function is not provided.");
        }
    };
    console.log(time, "<<<INITIME");
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.username}>{username || 'Unknown User'}</Text>
                <Text style={styles.time}>{time}</Text>
            </View>
            <Text style={styles.content}>{text || 'No content'}</Text>
            {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleLikePress} disabled={loading}>
                    <View style={styles.likesContainer}>
                        <Ionicons
                            name={liked ? "heart" : "heart-outline"}
                            size={24}
                            color={liked ? "red" : "black"}
                        />
                        <Text style={styles.likesText}>{safeLikes.length} Likes</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCommentPress}>
                    <View style={styles.commentsContainer}>
                        <Ionicons name="chatbubble-outline" size={24} color="black" />
                        <Text style={styles.commentsCount}>{safeComments.length} Comments</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>Failed to add like</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    time: {
        color: '#666',
    },
    content: {
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likesText: {
        marginLeft: 5,
        fontWeight: 'bold',
    },
    commentsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentsCount: {
        marginLeft: 5,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default PostCard;

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MessageBubble from "../components/MessageBubble";
import { useChat } from "../context/ChatContext";

export default function ChatScreen() {
  const { group } = useLocalSearchParams();
  const parsedGroup = JSON.parse(group);
  const { messages, sendMessage, typing, isSending } = useChat();
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const insets = useSafeAreaInsets();

  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  const groupMessages = messages[parsedGroup.id] || [];

  // Auto scroll to bottom
  useEffect(() => {
    if (groupMessages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [groupMessages]);

  // Handle typing indicator
  const handleTextChange = (newText) => {
    setText(newText);

    if (!isTyping) {
      setIsTyping(true);
      // Emit typing event to your backend here
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 1 second of no input
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Emit stop typing event here
    }, 1000);
  };

  const handleSend = async () => {
    if (!text.trim() || isSending) return;

    const messageText = text.trim();
    setText("");
    setIsTyping(false);

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    await sendMessage(parsedGroup.id, messageText);

    // Focus back on input after sending
    inputRef.current?.focus();
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter" && Platform.OS === "web") {
      handleSend();
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{parsedGroup.name}</Text>
              <Text style={styles.headerSubtitle}>
                {typing[parsedGroup.id] ? "Typing..." : "Online"}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="videocam" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="call" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={groupMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />

          {/* Typing Indicator */}
          {(typing[parsedGroup.id] || isTyping) && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color="#075E54" />
                <Text style={styles.typingText}>
                  {typing[parsedGroup.id]
                    ? "Someone is typing..."
                    : "Typing..."}
                </Text>
              </View>
            </View>
          )}

          {/* Input Area */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="attach" size={24} color="#075E54" />
              </TouchableOpacity>

              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={handleTextChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                style={styles.input}
                multiline
                maxLength={1000}
              />

              <TouchableOpacity style={styles.emojiButton}>
                <Ionicons name="happy-outline" size={24} color="#075E54" />
              </TouchableOpacity>

              {text.trim().length > 0 ? (
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    isSending && styles.sendButtonDisabled,
                  ]}
                  onPress={handleSend}
                  disabled={isSending}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="send" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.micButton}>
                  <Ionicons name="mic" size={24} color="#075E54" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5DDD5",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#075E54",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#064e44",
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerSubtitle: {
    color: "#dcf8c5",
    fontSize: 13,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 20,
  },
  headerButton: {
    padding: 4,
  },
  messageList: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    gap: 8,
  },
  typingText: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
  },
  inputWrapper: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  attachButton: {
    padding: 6,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    color: "#333",
  },
  emojiButton: {
    padding: 6,
    marginHorizontal: 4,
  },
  sendButton: {
    backgroundColor: "#075E54",
    borderRadius: 25,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  micButton: {
    padding: 6,
    marginLeft: 4,
  },
});

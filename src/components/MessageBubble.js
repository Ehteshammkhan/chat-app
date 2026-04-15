import { StyleSheet, Text, View } from "react-native";

export default function MessageBubble({ message }) {
  const isMe = message.sender === "me";

  return (
    <View style={[styles.container, isMe ? styles.right : styles.left]}>
      <View
        style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
      >
        <Text style={isMe ? styles.myText : styles.otherText}>
          {message.text}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.time}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>

          {isMe && (
            <Text style={styles.status}>
              {message.status === "read" ? "✔✔" : "✔"}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },

  bubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: "70%",
  },

  myBubble: {
    backgroundColor: "#DCF8C6",
  },
  otherBubble: {
    backgroundColor: "#fff",
  },

  myText: { color: "#000" },
  otherText: { color: "#000" },

  meta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },

  time: {
    fontSize: 10,
    color: "gray",
    marginRight: 5,
  },

  status: {
    fontSize: 10,
    color: "gray",
  },
});

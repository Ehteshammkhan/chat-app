import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useChat } from "../context/ChatContext";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createGroup } = useChat();
  const router = useRouter();

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      const newGroup = createGroup(name);
      setIsLoading(false);

      router.push({
        pathname: "/chat",
        params: { group: JSON.stringify(newGroup) },
      });
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New Group</Text>
            <Text style={styles.subtitle}>
              Give your group a name to get started
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Group Name</Text>
              <TextInput
                placeholder="e.g., Weekend Trip, Book Club, Team Alpha"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoFocus
                maxLength={50}
                returnKeyType="done"
                onSubmitEditing={handleCreate}
                editable={!isLoading}
              />
              {name.length > 0 && (
                <Text style={styles.charCount}>{name.length}/50</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.btn,
                (!name.trim() || isLoading) && styles.btnDisabled,
              ]}
              onPress={handleCreate}
              disabled={!name.trim() || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Create Group</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 32,
    position: "relative",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1a1a1a",
    transition: "borderColor 0.2s",
  },
  charCount: {
    position: "absolute",
    bottom: -20,
    right: 12,
    fontSize: 12,
    color: "#999",
  },
  btn: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

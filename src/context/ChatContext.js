import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import MockSocket from "../MockSocket";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [groups, setGroups] = useState([
    { id: "1", name: "Friends" },
    { id: "2", name: "Work" },
  ]);

  const [messages, setMessages] = useState({});
  const [typing, setTyping] = useState({});

  const socketRef = useRef(new MockSocket());
  const socket = socketRef.current;

  const createGroup = (name) => {
    const newGroup = {
      id: Date.now().toString(),
      name,
    };

    setGroups((prev) => [...prev, newGroup]);
    socket.connect([newGroup]);

    return newGroup;
  };

  useEffect(() => {
    socket.connect(groups);

    socket.on("message", (msg) => {
      setMessages((prev) => {
        const groupMsgs = prev[msg.groupId] || [];
        return {
          ...prev,
          [msg.groupId]: [...groupMsgs, msg],
        };
      });
    });

    socket.on("typing", ({ groupId, isTyping }) => {
      setTyping((prev) => ({ ...prev, [groupId]: isTyping }));
    });

    socket.on("read", ({ messageId }) => {
      setMessages((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((groupId) => {
          updated[groupId] = updated[groupId].map((msg) =>
            msg.id === messageId ? { ...msg, status: "read" } : msg,
          );
        });

        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = (groupId, text) => {
    socket.send({
      groupId,
      text,
      sender: "me",
    });
  };

  return (
    <ChatContext.Provider
      value={{
        groups,
        messages,
        typing,
        sendMessage,
        createGroup,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

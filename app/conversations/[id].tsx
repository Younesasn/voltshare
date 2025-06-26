import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventSource from "react-native-sse";
import FeatherIcon from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Message } from "@/interfaces/Message";
import moment from "moment";
import { getConversation } from "@/services/MessageService";

export default function Conversation() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const otherId = parseInt(id as string);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await getConversation(otherId);
      setMessages(res.data);
      // console.log(res.data);
      setIsLoading(false);
    } catch (e: any) {
      console.log("Error :" + e.getMessage());
    }
  };

  useEffect(() => {
    getData();
    const topic = `messages/${Math.min(user?.id!, otherId)}_${Math.max(user?.id!, otherId)}`;
    const url = `${process.env.EXPO_PUBLIC_MERCURE_URL}?topic=${topic}`;
    const es = new EventSource(url, {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUBSCRIBE_JWT}`,
      },
    });

    es.addEventListener("message", (event) => {
      console.log("Message reçu : ", event.data);
      const data = JSON.parse(event.data!);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      es.close();
    };
  }, []);

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  function parseSendAt(sendAt: any): string {
    if (typeof sendAt === "string") {
      return sendAt;
    }
    if (sendAt && typeof sendAt === "object" && sendAt.date) {
      // Format Mercure
      return sendAt.date.replace(" ", "T");
    }
    return "";
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <SafeAreaView
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors["shady-200"],
            paddingHorizontal: 10,
            paddingBottom: -20,
            gap: 12,
          }}
        >
          <TouchableOpacity onPress={router.back}>
            <FeatherIcon name="chevron-left" size={24} />
          </TouchableOpacity>
          <View
            style={{
              flex: 2,
              alignItems: "center",
              gap: 10,
              flexDirection: "row",
            }}
          >
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
              source={{
                uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
              }}
            />
            <ThemedText>Morgan Booster</ThemedText>
          </View>
        </SafeAreaView>

        {/* FlatList des messages */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            // ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              const isMe =
                typeof item.sender === "string"
                  ? user?.id === Number(item.sender.split("/")[3])
                  : user?.id === item.sender;
              return (
                <View
                  style={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    backgroundColor: isMe
                      ? Colors["shady-300"]
                      : Colors["shady-200"],
                    borderRadius: 12,
                    padding: 10,
                    marginBottom: 20,
                  }}
                >
                  <ThemedText>{item.content}</ThemedText>
                  <ThemedText
                    style={{ fontSize: 10, color: "#888", marginTop: 4 }}
                  >
                    {moment(parseSendAt(item.sendAt)).format("dddd DD MMMM yyyy HH:mm")}
                  </ThemedText>
                </View>
              );
            }}
            onScrollBeginDrag={() => setIsUserScrolling(true)}
            onScrollEndDrag={() => setIsUserScrolling(false)}
            onMomentumScrollEnd={() => setIsUserScrolling(false)}
            onContentSizeChange={() => {
              if (!isUserScrolling) {
                scrollToEnd();
              }
            }}
          />
          <SafeAreaView style={{ paddingHorizontal: 10, paddingTop: -60 }}>
            <TextInput style={styles.input} placeholder="Message" />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  input: {
    borderColor: Colors["shady-900"],
    borderWidth: 1,
    height: 45,
    borderRadius: 30,
    paddingHorizontal: 18,
  },
});

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
import { Message, SendMessage } from "@/interfaces/Message";
import moment from "moment";
import { sendMessage } from "@/services/MessageService";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AntDesign from "@expo/vector-icons/AntDesign";
import { User } from "@/interfaces/User";
import { getConversation } from "@/services/ConversationService";

moment.locale("fr");

export default function ConversationScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const conversationId = parseInt(id as string);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [otherUser, setOtherUser] = useState<User>();
  const [isInverted, setIsInverted] = useState<boolean>(true);
  const schema = z.object({
    message: z.string().min(1, "Veuillez écrire un message"),
  });
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });

  // A l'aide de l'id de la conversation, il faut la récup, puis récupérer l'hôte pour faire afficher ses infos
  const getData = async () => {
    try {
      setIsLoading(true);
      const dataConversation = await getConversation(conversationId);
      setOtherUser(
        user?.id !== dataConversation.data?.host.id
          ? dataConversation.data?.host
          : dataConversation.data?.customer
      );
      setMessages(dataConversation.data.messages);
      setIsLoading(false);
    } catch (e: any) {
      console.log("Error :" + e.getMessage());
    }
  };

  const send = async ({ message }: { message: string }) => {
    try {
      setIsLoading(true);
      const messageObject: SendMessage = {
        sender: user!,
        receiver: otherUser!,
        content: message,
        conversation: `/api/conversations/${conversationId}`,
        sendAt: new Date(),
      };
      await sendMessage(messageObject);
      setValue("message", "");
      setIsLoading(false);
    } catch (e) {
      console.log("Error : " + e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!user?.id || !otherUser?.id) return;
    const topic = `messages/${Math.min(user.id, otherUser.id)}_${Math.max(user.id, otherUser.id)}`;
    const url = `${process.env.EXPO_PUBLIC_MERCURE_URL}?topic=${topic}`;
    const es = new EventSource(url, {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUBSCRIBE_JWT}`,
      },
    });

    es.addEventListener("message", (event) => {
      const data = JSON.parse(event.data!);
      console.log(JSON.parse(event.data!));
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      es.close();
    };
  }, [user?.id, otherUser?.id]);

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  function parseSendAt(sendAt: any): string {
    if (typeof sendAt === "string") {
      return sendAt;
    }
    if (sendAt && typeof sendAt === "object" && sendAt.date) {
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
                borderWidth: 1,
              }}
              source={{
                uri:
                  otherUser?.avatar ??
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
            />
            <ThemedText>
              {otherUser?.firstname} {otherUser?.lastname}
            </ThemedText>
          </View>
        </SafeAreaView>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              const isMe = user?.id === item.sender.id;
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
                    {moment(parseSendAt(item.sendAt)).format("HH:mm")}
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
            // inverted={isInverted}
          />
          <SafeAreaView
            style={{
              paddingHorizontal: 10,
              paddingTop: -60,
            }}
          >
            <Controller
              control={control}
              name="message"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.input}>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{ flex: 1, paddingRight: 1 }}
                    placeholder="Message"
                  />
                  {value.length >= 1 ? (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                        borderRadius: 20,
                        backgroundColor: Colors["shady-950"],
                      }}
                      onPress={handleSubmit(send)}
                    >
                      <AntDesign
                        name="arrowup"
                        size={22}
                        color={Colors["shady-50"]}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            />
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
    paddingLeft: 18,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 4
  },
});

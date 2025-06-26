import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { useEffect, useState } from "react";
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
import { useRouter } from "expo-router";
import { Message } from "@/interfaces/Message";
import moment from "moment";

export default function Conversation() {
  const { user } = useAuth();
  const messagesMock: Message[] = [
    {
      id: 1,
      sender: user?.id!,
      receiver: 34,
      content: "Salut !",
      sendAt: moment().subtract(20, "minutes").toDate(),
    },
    {
      id: 2,
      sender: 34,
      receiver: user?.id!,
      content: "Salut, comment ça va ?",
      sendAt: moment().subtract(19, "minutes").toDate(),
    },
    {
      id: 3,
      sender: user?.id!,
      receiver: 34,
      content: "Ça va bien et toi ?",
      sendAt: moment().subtract(18, "minutes").toDate(),
    },
    {
      id: 4,
      sender: 34,
      receiver: user?.id!,
      content: "Super, merci ! Tu es dispo pour discuter ?",
      sendAt: moment().subtract(17, "minutes").toDate(),
    },
    {
      id: 5,
      sender: user?.id!,
      receiver: 34,
      content: "Oui, bien sûr 🙂",
      sendAt: moment().subtract(16, "minutes").toDate(),
    },
    {
      id: 6,
      sender: 34,
      receiver: user?.id!,
      content: "Génial ! J'avais une question à te poser.",
      sendAt: moment().subtract(15, "minutes").toDate(),
    },
    {
      id: 7,
      sender: user?.id!,
      receiver: 34,
      content: "Vas-y, je t'écoute.",
      sendAt: moment().subtract(14, "minutes").toDate(),
    },
    {
      id: 8,
      sender: 34,
      receiver: user?.id!,
      content: "Tu seras dispo demain pour qu'on se voie ?",
      sendAt: moment().subtract(13, "minutes").toDate(),
    },
    {
      id: 9,
      sender: user?.id!,
      receiver: 34,
      content: "Oui, demain après-midi ça me va !",
      sendAt: moment().subtract(12, "minutes").toDate(),
    },
    {
      id: 10,
      sender: 34,
      receiver: user?.id!,
      content: "Parfait, on se tient au courant alors. Merci !",
      sendAt: moment().subtract(11, "minutes").toDate(),
    },
    {
      id: 11,
      sender: user?.id!,
      receiver: 34,
      content: "Avec plaisir !",
      sendAt: moment().subtract(10, "minutes").toDate(),
    },
    {
      id: 12,
      sender: 34,
      receiver: user?.id!,
      content: "Tu as avancé sur le projet ?",
      sendAt: moment().subtract(9, "minutes").toDate(),
    },
    {
      id: 13,
      sender: user?.id!,
      receiver: 34,
      content: "Oui, j'ai presque terminé la première partie.",
      sendAt: moment().subtract(8, "minutes").toDate(),
    },
    {
      id: 14,
      sender: 34,
      receiver: user?.id!,
      content: "Super, hâte de voir ça !",
      sendAt: moment().subtract(7, "minutes").toDate(),
    },
    {
      id: 15,
      sender: user?.id!,
      receiver: 34,
      content: "Je t'enverrai un aperçu ce soir.",
      sendAt: moment().subtract(6, "minutes").toDate(),
    },
    {
      id: 16,
      sender: 34,
      receiver: user?.id!,
      content: "Top, merci beaucoup !",
      sendAt: moment().subtract(5, "minutes").toDate(),
    },
    {
      id: 17,
      sender: user?.id!,
      receiver: 34,
      content: "De rien, c'est normal.",
      sendAt: moment().subtract(4, "minutes").toDate(),
    },
    {
      id: 18,
      sender: 34,
      receiver: user?.id!,
      content: "On se capte demain alors.",
      sendAt: moment().subtract(3, "minutes").toDate(),
    },
    {
      id: 19,
      sender: user?.id!,
      receiver: 34,
      content: "Oui, à demain !",
      sendAt: moment().subtract(2, "minutes").toDate(),
    },
    {
      id: 20,
      sender: 34,
      receiver: user?.id!,
      content: "Bonne soirée !",
      sendAt: moment().subtract(1, "minutes").toDate(),
    },
  ];
  const otherUserId = 34;
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(messagesMock);

  useEffect(() => {
    const topic = `messages/${Math.min(user?.id!, otherUserId)}_${Math.max(user?.id!, otherUserId)}`;
    const url = `${process.env.EXPO_PUBLIC_MERCURE_URL}?topic=${topic}`;
    const es = new EventSource(url, {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUBSCRIBE_JWT}`,
      },
    });

    es.addEventListener("message", (event) => {
      console.log("Message reçu : ", event.data);
      const data = JSON.parse(event.data!);
      setMessages(data);
    });

    return () => {
      es.close();
    };
  }, []);

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
          keyboardVerticalOffset={-20}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            style={{ padding: 10 }}
            renderItem={({ item }) => {
              const isMe = user?.id === item.sender;
              return (
                <View
                  style={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    backgroundColor: isMe
                      ? Colors["shady-300"]
                      : Colors["shady-200"],
                    borderRadius: 12,
                    padding: 10,
                  }}
                >
                  <ThemedText>{item.content}</ThemedText>
                  <ThemedText
                    style={{ fontSize: 10, color: "#888", marginTop: 4 }}
                  >
                    {moment(item.sendAt).format("HH:mm")}
                  </ThemedText>
                </View>
              );
            }}
          />
          <SafeAreaView style={{ paddingHorizontal: 10, paddingTop: -40 }}>
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

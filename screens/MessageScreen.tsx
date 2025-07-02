import { ThemedText } from "@/themes/ThemedText";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "@expo/vector-icons/Feather";
import { Colors } from "@/themes/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Conversation } from "@/interfaces/Conversation";
import { getAllConversations } from "@/services/ConversationService";
import { useAuth } from "@/context/AuthContext";

export default function MessageScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>();

  const getData = async () => {
    try {
      const res = await getAllConversations();
      setConversations(res.data);
    } catch (e) {
      console.log("Error : " + e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  if (!conversations) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          gap: 10,
        }}
      >
        <ThemedText variant="title">Pas de conversations en cours.</ThemedText>
        <ThemedText>
          Passez une réservation pour entamer une discussion !
        </ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}></View>
        <ThemedText variant="logo">Messages</ThemedText>
      </View>
      <FlatList
        data={conversations}
        renderItem={({ item, index }) => {
          return (
            <View key={index} style={styles.cardWrapper}>
              <TouchableOpacity
                onPress={() => {
                  router.push(`/conversations/${item.id}`);
                }}
                style={styles.card}
              >
                <Image
                  alt=""
                  resizeMode="cover"
                  source={{
                    uri:
                      (user?.id === item.customer.id
                        ? item.host.avatar
                        : item.customer.avatar) ??
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  style={styles.cardImg}
                />
                <View style={styles.cardBody}>
                  <ThemedText>
                    {user?.id === item.customer.id
                      ? item.host.firstname + " " + item.host.lastname
                      : item.customer.firstname + " " + item.customer.lastname}
                  </ThemedText>
                  <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.textPreview}
                  >
                    {item.messages[item.messages.length - 1].sender.id ===
                    user?.id
                      ? "Moi : "
                      : "À vous : "}
                    {item.messages[item.messages.length - 1].content}
                  </ThemedText>
                </View>
                <View style={styles.cardIcon}>
                  <FeatherIcon
                    color={Colors["shady-400"]}
                    name="chevron-right"
                    size={20}
                  />
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingVertical: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: "700",
    color: "#1d1d1d",
  },
  /** Card */
  card: {
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: "#DFDFE0",
  },
  cardImg: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    marginRight: 12,
    borderWidth: 1,
  },
  cardBody: {
    maxWidth: "100%",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1d1d1d",
  },
  textPreview: {
    fontSize: 15,
    fontWeight: "500",
    color: "#737987",
    lineHeight: 20,
    marginTop: 4,
  },
  cardIcon: {
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
});

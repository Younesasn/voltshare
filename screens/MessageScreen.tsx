import { ThemedText } from "@/themes/ThemedText";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "@expo/vector-icons/Feather";
import { Colors } from "@/themes/Colors";
import { useRouter } from "expo-router";

export default function MessageScreen() {
  const router = useRouter();
  const items = [
    {
      img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
      name: "Nick Miller",
      message: "Looking forward to our collaboration!",
    },
    {
      img: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
      name: "Ashley",
      message: "Amazing!! 🔥🔥🔥",
    },
    {
      img: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      name: "Max",
      message: "Appreciate the opportunity to connect and share insights.",
    },
    {
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80",
      name: "Schmidt",
      message: "Let's bring creativity to the forefront of our discussions.",
    },
    {
      img: "https://images.unsplash.com/photo-1553240799-36bbf332a5c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      name: "Dwight",
      message: "Excited to explore opportunities for collaboration.",
    },
    {
      img: "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80",
      name: "Amy",
      message: "Eager to contribute and make a positive impact.",
    },
  ];
  items.push(...items);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}></View>
        <ThemedText variant="logo">Messages</ThemedText>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map(({ name, message, img }, index) => {
          return (
            <View key={index} style={styles.cardWrapper}>
              <TouchableOpacity
                onPress={() => {
                  router.push("/conversations");
                }}
                style={styles.card}
              >
                <Image
                  alt=""
                  resizeMode="cover"
                  source={{ uri: img }}
                  style={styles.cardImg}
                />
                <View style={styles.cardBody}>
                  <ThemedText>{name}</ThemedText>
                  <ThemedText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={styles.textPreview}
                  >
                    {message}
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
        })}
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

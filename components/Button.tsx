import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import {
  ExternalPathString,
  Link,
  Redirect,
  RelativePathString,
} from "expo-router";
import { StyleProp, StyleSheet, TouchableOpacity } from "react-native";

export default function Button({
  link,
  title,
  id,
  style,
}: {
  link: ExternalPathString | RelativePathString;
  title: string;
  id?: number;
  style?: StyleProp<any>;
}) {
  return (
    <Link
      href={{
        pathname: link,
        params: { id: id }
      }}
      style={[styles.button, style]}
    >
      {title}
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    backgroundColor: Colors["shady-950"],
    borderRadius: 8,
    paddingHorizontal: 15,
    color: Colors["shady-50"],
  },
});

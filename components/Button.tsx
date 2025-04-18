import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/themes/ThemedText";
import { Colors } from "@/themes/Colors";
import { ExternalPathString, Link, RelativePathString } from "expo-router";

export default function Button({
  link,
  title,
  id,
  style,
  onPress,
  isLoading = false,
  disabled = false,
}: {
  link?: ExternalPathString | RelativePathString;
  title: string;
  id?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => any;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  const buttonStyles = [
    styles.button,
    style,
    (isLoading || disabled) && styles.disabled,
  ];

  if (link) {
    return (
      <Link href={{ pathname: link, params: { id } }} style={buttonStyles}>
        {title}
      </Link>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyles}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors["shady-50"]} />
      ) : (
        <ThemedText color={Colors["shady-50"]}>{title}</ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    backgroundColor: Colors["shady-950"],
    color: Colors["shady-50"],
    borderRadius: 8,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
});

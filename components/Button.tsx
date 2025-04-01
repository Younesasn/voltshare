import { Colors } from "@/themes/Colors";
import { ExternalPathString, Link, RelativePathString } from "expo-router";
import { StyleSheet } from "react-native";

export default function Button({
  link,
  title,
}: {
  link: ExternalPathString | RelativePathString;
  title: string;
}) {
  return (
    <Link href={link} style={style.button}>
      {title}
    </Link>
  );
}

const style = StyleSheet.create({
  button: {
    paddingVertical: 10,
    backgroundColor: Colors["shady-950"],
    borderRadius: 8,
    paddingHorizontal: 15,
    color: Colors["shady-50"],
  },
});
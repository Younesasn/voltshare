import { Colors } from "@/themes/Colors";
import { ExternalPathString, Link, RelativePathString } from "expo-router";
import { StyleSheet } from "react-native";

export default function Button({
  link,
  title,
  id,
}: {
  link: ExternalPathString | RelativePathString;
  title: string;
  id?: number;
}) {
  return (
    <Link
      href={{
        pathname: link,
        params: { id: id }
      }}
      style={style.button}
    >
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

import React, { useEffect, useState } from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import { Ionicons, FontAwesome, Octicons } from "@expo/vector-icons";
import { Reservation } from "@/interfaces/Reservation";
import { ThemedText } from "@/themes/ThemedText";
import moment from "moment";
import { Progress, ProgressFilledTrack } from "./ui/progress";

export default function ReservationCard({
  reservation,
  inProgress,
}: {
  readonly reservation: Reservation;
  readonly inProgress?: boolean;
}) {
  const [percent, setPercent] = useState(() => {
    const totalDuration = moment(reservation.endTime)
      .add(1, "hour")
      .diff(moment(reservation.startTime));
    const elapsed = moment().diff(moment(reservation.startTime));
    let p = Math.round((elapsed / totalDuration) * 100);
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    return p;
  });
  const imageUrl = process.env.EXPO_PUBLIC_API_URL + "/images/station/";

  useEffect(() => {
    if (!inProgress) return;
    const interval = setInterval(() => {
      const totalDuration = moment(reservation.endTime)
        .add(1, "hour")
        .diff(moment(reservation.startTime));
      const elapsed = moment().diff(moment(reservation.startTime));
      let p = Math.round((elapsed / totalDuration) * 100);
      if (p < 0) p = 0;
      if (p > 100) p = 100;
      setPercent(p);
    }, 1000);

    return () => clearInterval(interval);
  }, [inProgress, reservation.startTime, reservation.endTime]);

  const cardContent = (
    <View
      style={[
        inProgress
          ? { borderWidth: 1, borderRadius: 16, backgroundColor: "white" }
          : styles.overlay,
        { flexDirection: "row", padding: 16, gap: 6 },
      ]}
    >
      <View style={{ width: "100%", gap: 8 }}>
        <ThemedText color={inProgress ? "" : "white"} variant="subtitle">
          {reservation.station.name}
        </ThemedText>
        <View style={{ gap: 2, width: "100%" }}>
          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={16}
              color={inProgress ? "" : "#fff"}
            />
            <ThemedText color={inProgress ? "" : "white"}>
              {reservation.station.adress}
            </ThemedText>
          </View>
          <View style={styles.row}>
            <FontAwesome
              name="calendar"
              size={16}
              color={inProgress ? "" : "#fff"}
            />
            <ThemedText color={inProgress ? "" : "white"}>
              {moment(reservation.startTime).format("dddd DD MMMM")}
            </ThemedText>
          </View>
          <View style={styles.row}>
            <FontAwesome
              name="euro"
              size={20}
              color={inProgress ? "" : "#fff"}
            />
            <ThemedText color={inProgress ? "" : "white"}>
              {reservation.price} euros
            </ThemedText>
          </View>
          <View style={styles.row}>
            <Ionicons
              name="time-outline"
              size={16}
              color={inProgress ? "" : "#fff"}
            />
            <ThemedText color={inProgress ? "" : "white"}>
              {moment(reservation.startTime).format("HH:mm")} →{" "}
              {moment(reservation.endTime).add(1, "hour").format("HH:mm")}
            </ThemedText>
          </View>
          {inProgress && (
            <View
              style={{
                position: "relative",
                width: "100%",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Progress
                value={percent}
                size="sm"
                orientation="horizontal"
                style={{
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "#22c55e",
                }}
                className="bg-[#fff]"
              >
                <ProgressFilledTrack className="bg-green-400" />
              </Progress>
              <Octicons
                name="zap"
                size={22}
                color={percent <= 49 ? "#22c55e" : "#15803d"}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: [{ translateX: -10 }, { translateY: -10 }],
                  zIndex: 10,
                  backgroundColor: "white",
                }}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      {inProgress ? (
        <View style={{ marginTop: 10 }}>{cardContent}</View>
      ) : (
        <ImageBackground
          src={imageUrl + reservation.station.picture}
          imageStyle={styles.image}
          style={styles.imageContainer}
          blurRadius={6}
        >
          {cardContent}
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  imageContainer: {
    height: 200,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});

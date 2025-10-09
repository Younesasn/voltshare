import { Reservation } from "@/interfaces/Reservation";
import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Progress, ProgressFilledTrack } from "./ui/progress";

export default function ReservationCard({
  reservation,
  isNotClient,
  inProgress,
}: {
  readonly reservation: Reservation;
  readonly isNotClient?: boolean;
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

  const date = reservation.startTime
    ? moment(reservation.startTime)
    : undefined;
  const endDate = reservation.endTime ? moment(reservation.endTime) : undefined;
  const now = moment();

  let statusLabel = "À venir";
  let statusColor = Colors["shady-800"];
  if (endDate && now.isAfter(endDate)) {
    statusLabel = "Terminée";
    statusColor = "green";
  } else if (date && endDate && now.isBetween(date, endDate, undefined, "[)")) {
    statusLabel = "En cours";
    statusColor = "orange";
  }

  return (
    <View style={styles.card}>
      <View style={[styles.row, { gap: 8 }]}>
        <Ionicons name="person-circle" size={32} color={Colors["shady-700"]} />
        <View style={{ flex: 1 }}>
          {isNotClient ? (
            <ThemedText variant="subtitle">
              {reservation.user?.firstname} {reservation.user?.lastname}
            </ThemedText>
          ) : (
            <ThemedText variant="subtitle">
              {reservation.station.name}
            </ThemedText>
          )}
          <ThemedText color={Colors["shady-500"]}>
            {isNotClient ? reservation.user?.email : reservation.station.adress}
          </ThemedText>
        </View>
        <View style={[styles.status, { backgroundColor: statusColor }]}>
          <ThemedText variant="lilText" color={"white"}>
            {statusLabel}
          </ThemedText>
        </View>
      </View>
      <View style={styles.row}>
        <View
          style={{ flexDirection: "row", gap: 4, justifyContent: "center" }}
        >
          <Ionicons name="calendar" size={18} color={Colors["shady-700"]} />
          <ThemedText>{date ? date.format("DD MMMM YYYY") : "-"}</ThemedText>
        </View>
        <View
          style={{ flexDirection: "row", gap: 4, justifyContent: "center" }}
        >
          <FontAwesome name="euro" size={18} color={Colors["shady-700"]} />
          <ThemedText>{reservation.price}</ThemedText>
        </View>
        <View
          style={{ flexDirection: "row", gap: 4, justifyContent: "center" }}
        >
          <Ionicons name="time" size={18} color={Colors["shady-700"]} />
          <ThemedText>
            {date ? date.format("HH:mm") : "-"} -&gt;{" "}
            {endDate ? endDate.add(1, "hour").format("HH:mm") : "-"}
          </ThemedText>
        </View>
      </View>
      {inProgress && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Octicons name="zap" size={18} color={"#4ade80"} />
          <Progress
            value={percent}
            size="sm"
            orientation="horizontal"
            style={{
              flex: 1,
            }}
            className="bg-[#fff]"
          >
            <ProgressFilledTrack className="bg-green-400" />
          </Progress>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors["shady-200"],
    borderRadius: 16,
    padding: 14,
    shadowColor: Colors["shady-900"],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  status: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
});

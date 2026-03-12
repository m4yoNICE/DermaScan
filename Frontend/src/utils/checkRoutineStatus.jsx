import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";

export function checkRoutineStatus(logs) {
  // logs is an array like ["Morning"], ["Morning", "Night"], or []
  if (!logs || logs.length === 0) return "none";
  if (logs.length === 1) return "partial";
  return "complete";
}

export function getRoutineIcon(logs) {
  if (!logs || logs.length === 0)
    return <Entypo name="circle-with-cross" size={30} color="#ff5252" />;
  if (logs.length === 1)
    return (
      <MaterialCommunityIcons
        name="fraction-one-half"
        size={30}
        color="#f59e0b"
      />
    );
  return <Ionicons name="checkmark-circle" size={30} color="#00CC99" />;
}

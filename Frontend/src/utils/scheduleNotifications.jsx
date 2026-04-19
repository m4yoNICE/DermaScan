// utils/scheduleNotifications.js
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleRoutineNotification({ schedule, time }) {
  // time is "HH:mm:ss" string from backend
  const [hours, minutes] = time.split(":").map(Number);

  await Notifications.cancelScheduledNotificationAsync(schedule); // cancel existing by id

  await Notifications.scheduleNotificationAsync({
    identifier: schedule, // "Morning" or "Night" — used to cancel/replace
    content: {
      title: `${schedule} Skincare Routine 🌿`,
      body: `Time for your ${schedule.toLowerCase()} routine!`,
    },
    trigger: {
      type: "daily",
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
}

export async function cancelRoutineNotification(schedule) {
  await Notifications.cancelScheduledNotificationAsync(schedule);
}

export async function scheduleAllRoutineNotifications(routineSchedule) {
  if (!routineSchedule) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  await scheduleRoutineNotification({
    schedule: "Morning",
    time: routineSchedule.morningTime,
  });

  await scheduleRoutineNotification({
    schedule: "Night",
    time: routineSchedule.eveningTime,
  });
}

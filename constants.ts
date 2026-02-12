
import { Student, Camera, AttendanceRecord } from './types';

export const MASTER_STUDENTS: Student[] = [
  { id: "S1001", name: "Aisha Kapoor" },
  { id: "S1002", name: "Rahul Mehta" },
  { id: "S1003", name: "Lin Wei" },
  { id: "S1004", name: "Carlos Mendez" },
  { id: "S1005", name: "Fatima Zahra" },
  { id: "S1006", name: "James Carter" },
  { id: "S1007", name: "Sarah Jenkins" },
  { id: "S1008", name: "Hiroki Tanaka" }
];

export const INITIAL_CAMERAS: Camera[] = [
  { id: "cam-1", name: "Front Entry", location: "Entrance", status: "Online", lastSeen: "2024-05-20 09:00" },
  { id: "cam-2", name: "Quiet Zone 1", location: "AC Room", status: "Online", lastSeen: "2024-05-20 09:05" },
  { id: "cam-3", name: "Hallway North", location: "Non-AC Room", status: "Offline", lastSeen: "2024-05-19 22:00" }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { studentId: "S1001", name: "Aisha Kapoor", room: "AC", timestamp: "2024-05-20 08:30" },
  { studentId: "S1003", name: "Lin Wei", room: "Non-AC", timestamp: "2024-05-20 08:45" }
];

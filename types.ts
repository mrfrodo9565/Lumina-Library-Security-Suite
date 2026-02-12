
export type Role = 'CEO' | 'STUDENT' | null;

export interface Student {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  studentId: string;
  name: string;
  room: 'AC' | 'Non-AC';
  timestamp: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
}

export interface AppState {
  attendance: AttendanceRecord[];
  cameras: Camera[];
}

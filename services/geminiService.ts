
import { GoogleGenAI } from "@google/genai";
import { AppState, Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getLibraryInsights = async (state: AppState, masterStudents: Student[], query: string) => {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Context: Library Management System.
      Current Stats:
      - Total Registered Students: ${masterStudents.length}
      - Present Today: ${state.attendance.length}
      - AC Room Usage: ${state.attendance.filter(a => a.room === 'AC').length}
      - Non-AC Room Usage: ${state.attendance.filter(a => a.room === 'Non-AC').length}
      - Active Cameras: ${state.cameras.filter(c => c.status === 'Online').length}
      - Offline Cameras: ${state.cameras.filter(c => c.status === 'Offline').length}

      User Question: ${query}

      Please provide a professional, concise response suitable for a Library CEO.
    `,
  });

  const response = await model;
  return response.text;
};

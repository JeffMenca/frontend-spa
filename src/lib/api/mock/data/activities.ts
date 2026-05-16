// MOCK: Remove this file when backend is ready.
// Replace with real upstream calls via active-conference.ts wrapper.

import type { ActivityData } from "@/lib/validators/activity";
import { MOCK_CONGRESS_1_ID } from "./congresses";
import { MOCK_ROOM_1_ID, MOCK_ROOM_2_ID, MOCK_ROOM_3_ID } from "./rooms";
import { MOCK_GUEST_SPEAKER_ID, MOCK_PARTICIPANT_2_ID } from "./users";

export const MOCK_ACTIVITY_1_ID = "40000000-0000-0000-0000-000000000001";
export const MOCK_ACTIVITY_2_ID = "40000000-0000-0000-0000-000000000002";
export const MOCK_ACTIVITY_3_ID = "40000000-0000-0000-0000-000000000003";
export const MOCK_ACTIVITY_4_ID = "40000000-0000-0000-0000-000000000004";

export const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: MOCK_ACTIVITY_1_ID,
    congressId: MOCK_CONGRESS_1_ID,
    roomId: MOCK_ROOM_1_ID,
    name: "Arquitectura de Microservicios",
    description:
      "Presentacion sobre patrones de diseno y mejores practicas en arquitecturas de microservicios modernas.",
    type: "PONENCIA",
    startTime: "2026-07-15T09:00:00Z",
    endTime: "2026-07-15T10:30:00Z",
    leaders: [MOCK_GUEST_SPEAKER_ID],
    workshopCapacity: null,
    createdAt: "2026-05-05T08:00:00Z",
    updatedAt: "2026-05-05T08:00:00Z",
  },
  {
    id: MOCK_ACTIVITY_2_ID,
    congressId: MOCK_CONGRESS_1_ID,
    roomId: MOCK_ROOM_2_ID,
    name: "Docker y Kubernetes Practico",
    description:
      "Taller practico de contenedorizacion y orquestacion con Docker y Kubernetes. Los participantes configuraran un cluster desde cero.",
    type: "TALLER",
    startTime: "2026-07-15T11:00:00Z",
    endTime: "2026-07-15T13:00:00Z",
    leaders: [MOCK_PARTICIPANT_2_ID],
    workshopCapacity: 20,
    createdAt: "2026-05-05T08:00:00Z",
    updatedAt: "2026-05-05T08:00:00Z",
  },
  {
    id: MOCK_ACTIVITY_3_ID,
    congressId: MOCK_CONGRESS_1_ID,
    roomId: MOCK_ROOM_3_ID,
    name: "Taller de Machine Learning",
    description:
      "Introduccion practica a machine learning con Python y scikit-learn. Cupo limitado.",
    type: "TALLER",
    startTime: "2026-07-15T14:00:00Z",
    endTime: "2026-07-15T16:00:00Z",
    leaders: [MOCK_GUEST_SPEAKER_ID],
    workshopCapacity: 5,
    createdAt: "2026-05-05T08:00:00Z",
    updatedAt: "2026-05-05T08:00:00Z",
  },
  {
    id: MOCK_ACTIVITY_4_ID,
    congressId: MOCK_CONGRESS_1_ID,
    roomId: MOCK_ROOM_3_ID,
    name: "Seguridad en Aplicaciones Web",
    description:
      "Ponencia sobre vulnerabilidades OWASP Top 10 y estrategias de mitigacion en aplicaciones web modernas.",
    type: "PONENCIA",
    startTime: "2026-07-16T09:00:00Z",
    endTime: "2026-07-16T10:30:00Z",
    leaders: [MOCK_GUEST_SPEAKER_ID],
    workshopCapacity: null,
    createdAt: "2026-05-05T08:00:00Z",
    updatedAt: "2026-05-05T08:00:00Z",
  },
];

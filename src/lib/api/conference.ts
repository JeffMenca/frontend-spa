import "server-only";

import { apiFetch, apiFetchBinary } from "./client";
import {
  InstitutionSchema,
  InstitutionListSchema,
  type InstitutionData,
  type InstitutionListData,
} from "@/lib/validators/institution";
import {
  CongressSchema,
  CongressListSchema,
  type CongressData,
  type CongressListData,
} from "@/lib/validators/congress";
import {
  RoomSchema,
  RoomListSchema,
  type RoomData,
  type RoomListData,
} from "@/lib/validators/room";
import {
  ActivitySchema,
  ActivityListSchema,
  type ActivityData,
  type ActivityListData,
} from "@/lib/validators/activity";
import {
  ProposalSchema,
  ProposalListSchema,
  type ProposalData,
  type ProposalListData,
} from "@/lib/validators/proposal";
import {
  EnrollmentSchema,
  EnrollmentListSchema,
  type EnrollmentData,
  type EnrollmentListData,
} from "@/lib/validators/enrollment";
import {
  ReservationSchema,
  ReservationListSchema,
  type ReservationData,
  type ReservationListData,
} from "@/lib/validators/reservation";
import {
  AttendanceSchema,
  AttendanceListSchema,
  type AttendanceData,
  type AttendanceListData,
} from "@/lib/validators/attendance";
import {
  CallSchema,
  CallListSchema,
  type CallData,
  type CallListData,
} from "@/lib/validators/call";
import {
  CommitteeMemberSchema,
  CommitteeMemberListSchema,
  type CommitteeMemberData,
  type CommitteeMemberListData,
} from "@/lib/validators/committee";
import {
  DiplomaSchema,
  DiplomaListSchema,
  type DiplomaData,
  type DiplomaListData,
} from "@/lib/validators/diploma";
import {
  ParticipantReportSchema,
  AttendanceByActivityReportSchema,
  WorkshopReservationReportSchema,
  EarningsByCongressReportSchema,
  EarningsReportSchema,
  CongressesByInstitutionReportSchema,
  type ParticipantReportData,
  type AttendanceByActivityReportData,
  type WorkshopReservationReportData,
  type EarningsByCongressReportData,
  type EarningsReportData,
  type CongressesByInstitutionReportData,
} from "@/lib/validators/reports";
import { z } from "zod";

const GATEWAY = process.env["GATEWAY_URL"] ?? "http://localhost:8080";
const CONFERENCE_URL = `${GATEWAY}/api/v1`;

// --- Institutions ---

export async function listInstitutions(params: URLSearchParams): Promise<InstitutionListData> {
  return apiFetch(`${CONFERENCE_URL}/institutions?${params.toString()}`, InstitutionListSchema);
}

export async function getInstitution(id: string): Promise<InstitutionData> {
  return apiFetch(`${CONFERENCE_URL}/institutions/${id}`, InstitutionSchema);
}

export async function createInstitution(data: unknown, token: string): Promise<InstitutionData> {
  return apiFetch(`${CONFERENCE_URL}/institutions`, InstitutionSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateInstitution(
  id: string,
  data: unknown,
  token: string,
): Promise<InstitutionData> {
  return apiFetch(`${CONFERENCE_URL}/institutions/${id}`, InstitutionSchema, {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deleteInstitution(id: string, token: string): Promise<void> {
  await apiFetch(`${CONFERENCE_URL}/institutions/${id}`, z.unknown(), {
    method: "DELETE",
    token,
  });
}

// --- Congresses ---

export async function listCongresses(params: URLSearchParams): Promise<CongressListData> {
  return apiFetch(`${CONFERENCE_URL}/congresses?${params.toString()}`, CongressListSchema);
}

export async function getCongress(id: string): Promise<CongressData> {
  return apiFetch(`${CONFERENCE_URL}/congresses/${id}`, CongressSchema);
}

export async function createCongress(data: unknown, token: string): Promise<CongressData> {
  return apiFetch(`${CONFERENCE_URL}/congresses`, CongressSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateCongress(
  id: string,
  data: unknown,
  token: string,
): Promise<CongressData> {
  return apiFetch(`${CONFERENCE_URL}/congresses/${id}`, CongressSchema, {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deleteCongress(id: string, token: string): Promise<void> {
  await apiFetch(`${CONFERENCE_URL}/congresses/${id}`, z.unknown(), {
    method: "DELETE",
    token,
  });
}

// --- Rooms ---

export async function listRooms(
  congressId: string,
  params: URLSearchParams,
): Promise<RoomListData> {
  return apiFetch(
    `${CONFERENCE_URL}/congresses/${congressId}/rooms?${params.toString()}`,
    RoomListSchema,
  );
}

export async function getRoom(id: string): Promise<RoomData> {
  return apiFetch(`${CONFERENCE_URL}/rooms/${id}`, RoomSchema);
}

export async function createRoom(
  congressId: string,
  data: unknown,
  token: string,
): Promise<RoomData> {
  return apiFetch(`${CONFERENCE_URL}/congresses/${congressId}/rooms`, RoomSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateRoom(id: string, data: unknown, token: string): Promise<RoomData> {
  return apiFetch(`${CONFERENCE_URL}/rooms/${id}`, RoomSchema, {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deleteRoom(id: string, token: string): Promise<void> {
  await apiFetch(`${CONFERENCE_URL}/rooms/${id}`, z.unknown(), {
    method: "DELETE",
    token,
  });
}

// --- Activities ---

export async function listActivities(
  congressId: string,
  params: URLSearchParams,
): Promise<ActivityListData> {
  return apiFetch(
    `${CONFERENCE_URL}/congresses/${congressId}/activities?${params.toString()}`,
    ActivityListSchema,
  );
}

export async function getActivity(id: string): Promise<ActivityData> {
  return apiFetch(`${CONFERENCE_URL}/activities/${id}`, ActivitySchema);
}

export async function createActivity(
  congressId: string,
  data: unknown,
  token: string,
): Promise<ActivityData> {
  return apiFetch(`${CONFERENCE_URL}/congresses/${congressId}/activities`, ActivitySchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function updateActivity(
  id: string,
  data: unknown,
  token: string,
): Promise<ActivityData> {
  return apiFetch(`${CONFERENCE_URL}/activities/${id}`, ActivitySchema, {
    method: "PUT",
    body: data,
    token,
  });
}

export async function deleteActivity(id: string, token: string): Promise<void> {
  await apiFetch(`${CONFERENCE_URL}/activities/${id}`, z.unknown(), {
    method: "DELETE",
    token,
  });
}

// --- Proposals ---

export async function listProposals(
  callId: string,
  token: string,
  params: URLSearchParams,
): Promise<ProposalListData> {
  return apiFetch(
    `${CONFERENCE_URL}/calls/${callId}/proposals?${params.toString()}`,
    ProposalListSchema,
    { token },
  );
}

export async function getUserProposals(userId: string, token: string): Promise<ProposalListData> {
  return apiFetch(`${CONFERENCE_URL}/users/${userId}/proposals`, ProposalListSchema, { token });
}

export async function createProposal(
  callId: string,
  data: unknown,
  token: string,
): Promise<ProposalData> {
  return apiFetch(`${CONFERENCE_URL}/calls/${callId}/proposals`, ProposalSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function approveProposal(id: string, token: string): Promise<ProposalData> {
  return apiFetch(`${CONFERENCE_URL}/proposals/${id}/approve`, ProposalSchema, {
    method: "PATCH",
    token,
  });
}

export async function rejectProposal(id: string, token: string): Promise<ProposalData> {
  return apiFetch(`${CONFERENCE_URL}/proposals/${id}/reject`, ProposalSchema, {
    method: "PATCH",
    token,
  });
}

// --- Enrollments ---

export async function enrollInCongress(
  congressId: string,
  data: unknown,
  token: string,
  idempotencyKey: string,
): Promise<EnrollmentData> {
  return apiFetch(`${CONFERENCE_URL}/congresses/${congressId}/enrollments`, EnrollmentSchema, {
    method: "POST",
    body: data,
    token,
    idempotencyKey,
  });
}

export async function getUserEnrollments(
  userId: string,
  token: string,
): Promise<EnrollmentListData> {
  return apiFetch(`${CONFERENCE_URL}/users/${userId}/enrollments`, EnrollmentListSchema, { token });
}

export async function getCongressEnrollments(
  congressId: string,
  token: string,
): Promise<EnrollmentListData> {
  return apiFetch(`${CONFERENCE_URL}/congresses/${congressId}/enrollments`, EnrollmentListSchema, {
    token,
  });
}

// --- Reservations ---

export async function reserveActivity(activityId: string, token: string): Promise<ReservationData> {
  return apiFetch(`${CONFERENCE_URL}/activities/${activityId}/reservations`, ReservationSchema, {
    method: "POST",
    token,
  });
}

export async function getActivityReservations(
  activityId: string,
  token: string,
): Promise<ReservationListData> {
  return apiFetch(
    `${CONFERENCE_URL}/activities/${activityId}/reservations`,
    ReservationListSchema,
    { token },
  );
}

export async function getUserReservations(
  userId: string,
  token: string,
): Promise<ReservationListData> {
  return apiFetch(`${CONFERENCE_URL}/users/${userId}/reservations`, ReservationListSchema, {
    token,
  });
}

export async function cancelReservation(id: string, token: string): Promise<void> {
  await apiFetch(`${CONFERENCE_URL}/reservations/${id}`, z.unknown(), {
    method: "DELETE",
    token,
  });
}

// --- Attendance ---

export async function registerAttendance(data: unknown, token: string): Promise<AttendanceData> {
  return apiFetch(`${CONFERENCE_URL}/attendance/register`, AttendanceSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function listAttendance(
  token: string,
  params: URLSearchParams,
): Promise<AttendanceListData> {
  return apiFetch(`${CONFERENCE_URL}/attendance?${params.toString()}`, AttendanceListSchema, {
    token,
  });
}

// --- Calls ---

export async function listCalls(
  congressId: string,
  params: URLSearchParams,
): Promise<CallListData> {
  return apiFetch(
    `${CONFERENCE_URL}/congresses/${congressId}/calls?${params.toString()}`,
    CallListSchema,
  );
}

export async function createCall(congressId: string, token: string): Promise<CallData> {
  return apiFetch(`${CONFERENCE_URL}/congresses/${congressId}/calls`, CallSchema, {
    method: "POST",
    token,
  });
}

export async function closeCall(callId: string, token: string): Promise<CallData> {
  return apiFetch(`${CONFERENCE_URL}/calls/${callId}/close`, CallSchema, {
    method: "PATCH",
    token,
  });
}

// --- Scientific Committee ---

export async function getCommitteeMembers(
  congressId: string,
  token: string,
): Promise<CommitteeMemberListData> {
  return apiFetch(
    `${CONFERENCE_URL}/congresses/${congressId}/committee`,
    CommitteeMemberListSchema,
    { token },
  );
}

export async function addCommitteeMember(
  congressId: string,
  data: unknown,
  token: string,
): Promise<CommitteeMemberData> {
  return apiFetch(`${CONFERENCE_URL}/congresses/${congressId}/committee`, CommitteeMemberSchema, {
    method: "POST",
    body: data,
    token,
  });
}

export async function removeCommitteeMember(
  congressId: string,
  userId: string,
  token: string,
): Promise<void> {
  await apiFetch(`${CONFERENCE_URL}/congresses/${congressId}/committee/${userId}`, z.unknown(), {
    method: "DELETE",
    token,
  });
}

// --- Diplomas ---

export async function getDiplomasByUser(userId: string, token: string): Promise<DiplomaListData> {
  return apiFetch(`${CONFERENCE_URL}/users/${userId}/diplomas`, DiplomaListSchema, { token });
}

export async function getDiploma(id: string, token: string): Promise<DiplomaData> {
  return apiFetch(`${CONFERENCE_URL}/diplomas/${id}`, DiplomaSchema, { token });
}

export async function downloadDiploma(id: string, token: string): Promise<ArrayBuffer> {
  return apiFetchBinary(`${CONFERENCE_URL}/diplomas/${id}/download`, { token });
}

// --- Reports (CongressAdmin) ---

export async function getParticipantReport(
  token: string,
  params: URLSearchParams,
): Promise<ParticipantReportData> {
  return apiFetch(
    `${CONFERENCE_URL}/reports/participants?${params.toString()}`,
    ParticipantReportSchema,
    { token },
  );
}

export async function getAttendanceByActivityReport(
  token: string,
  params: URLSearchParams,
): Promise<AttendanceByActivityReportData> {
  return apiFetch(
    `${CONFERENCE_URL}/reports/attendance-by-activity?${params.toString()}`,
    AttendanceByActivityReportSchema,
    { token },
  );
}

export async function getWorkshopReservationReport(
  token: string,
  params: URLSearchParams,
): Promise<WorkshopReservationReportData> {
  return apiFetch(
    `${CONFERENCE_URL}/reports/workshop-reservations?${params.toString()}`,
    WorkshopReservationReportSchema,
    { token },
  );
}

export async function getEarningsByCongressReport(
  token: string,
  params: URLSearchParams,
): Promise<EarningsByCongressReportData> {
  return apiFetch(
    `${CONFERENCE_URL}/reports/earnings-by-congress?${params.toString()}`,
    EarningsByCongressReportSchema,
    { token },
  );
}

// --- Reports (SystemAdmin) ---

export async function getPlatformEarningsReport(
  token: string,
  params: URLSearchParams,
): Promise<EarningsReportData> {
  return apiFetch(`${CONFERENCE_URL}/reports/earnings?${params.toString()}`, EarningsReportSchema, {
    token,
  });
}

export async function getCongressesByInstitutionReport(
  token: string,
  params: URLSearchParams,
): Promise<CongressesByInstitutionReportData> {
  return apiFetch(
    `${CONFERENCE_URL}/reports/congresses-by-institution?${params.toString()}`,
    CongressesByInstitutionReportSchema,
    { token },
  );
}

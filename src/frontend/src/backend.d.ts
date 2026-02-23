import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface TestResult {
    totalMarks: string;
    globalRank?: bigint;
    rank?: bigint;
    examDate: Time;
    examName: string;
    percentage: number;
    hasAttachment: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTestResultForStudent(student: Principal, testResult: TestResult): Promise<void>;
    deleteTestResultForStudent(student: Principal, examName: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTestResults(): Promise<Array<TestResult>>;
    getTestResultsFor(student: Principal): Promise<Array<TestResult>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTestResultForStudent(student: Principal, examName: string, updatedResult: TestResult): Promise<void>;
}

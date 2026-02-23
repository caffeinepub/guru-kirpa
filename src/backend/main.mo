import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type TestResult = {
    examName : Text;
    examDate : Time.Time;
    totalMarks : Text; // Format: "scored/maximum"
    percentage : Float;
    rank : ?Nat;
    globalRank : ?Nat;
    hasAttachment : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let testResults = Map.empty<Principal, List.List<TestResult>>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Test Results Management - Admin Only Create/Update/Delete
  public shared ({ caller }) func createTestResultForStudent(student : Principal, testResult : TestResult) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create test results");
    };

    let existingResults = switch (testResults.get(student)) {
      case (null) { List.empty<TestResult>() };
      case (?results) { results };
    };

    if (existingResults.any(func(result) { result.examName == testResult.examName })) {
      Runtime.trap("Test result for this exam already exists for the student");
    };

    existingResults.add(testResult);
    testResults.add(student, existingResults);
  };

  public shared ({ caller }) func updateTestResultForStudent(student : Principal, examName : Text, updatedResult : TestResult) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update test results");
    };

    let currentResults = switch (testResults.get(student)) {
      case (null) { Runtime.trap("No test results found for this student") };
      case (?results) { results };
    };

    let hasExam = currentResults.any(func(result) { result.examName == examName });
    if (not hasExam) {
      Runtime.trap("Test result not found for the specified exam name");
    };

    let updatedResults = currentResults.map<TestResult, TestResult>(
      func(result) {
        if (result.examName == examName) { updatedResult } else { result };
      }
    );

    testResults.add(student, updatedResults);
  };

  public shared ({ caller }) func deleteTestResultForStudent(student : Principal, examName : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete test results");
    };

    let currentResults = switch (testResults.get(student)) {
      case (null) { Runtime.trap("No test results found for this student") };
      case (?results) { results };
    };

    if (not currentResults.any(func(result) { result.examName == examName })) {
      Runtime.trap("Test result not found for the specified exam name");
    };

    let filteredResults = currentResults.filter(
      func(result) { result.examName != examName }
    );

    testResults.add(student, filteredResults);
  };

  // Test Results Viewing - Students can view their own, Admins can view any
  public query ({ caller }) func getTestResults() : async [TestResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view test results");
    };

    switch (testResults.get(caller)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };

  public query ({ caller }) func getTestResultsFor(student : Principal) : async [TestResult] {
    if (caller != student and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view other students' test results");
    };

    switch (testResults.get(student)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };
};

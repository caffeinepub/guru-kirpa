import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldTestResult = {
    studentName : Text;
    testName : Text;
    score : Nat;
    date : Text;
    subject : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    testResults : Map.Map<Principal, List.List<OldTestResult>>;
  };

  type NewTestResult = {
    examName : Text;
    examDate : Time.Time;
    totalMarks : Text;
    percentage : Float;
    rank : ?Nat;
    globalRank : ?Nat;
    hasAttachment : Bool;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    testResults : Map.Map<Principal, List.List<NewTestResult>>;
  };

  public func run(old : OldActor) : NewActor {
    let newTestResults = old.testResults.map<Principal, List.List<OldTestResult>, List.List<NewTestResult>>(
      func(_student, oldResults) {
        oldResults.map<OldTestResult, NewTestResult>(
          func(oldResult) {
            {
              examName = oldResult.testName;
              examDate = Time.now();
              totalMarks = "0/360";
              percentage = 0.0;
              rank = null;
              globalRank = null;
              hasAttachment = false;
            };
          }
        );
      }
    );

    { old with testResults = newTestResults };
  };
};

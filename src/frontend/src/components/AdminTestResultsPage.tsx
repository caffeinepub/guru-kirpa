import { useState } from 'react';
import { useGetCallerUserRole } from '../hooks/useGetCallerUserRole';
import { useGetTestResultsFor, useDeleteTestResult } from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, Plus, Pencil, Trash2, Paperclip } from 'lucide-react';
import { UserRole } from '../backend';
import { Principal } from '@dfinity/principal';
import TestResultForm from './TestResultForm';
import { formatGlobalRank } from '../utils/formatTestResult';
import type { TestResult } from '../backend';

interface AdminTestResultsPageProps {
  onBack: () => void;
}

export default function AdminTestResultsPage({ onBack }: AdminTestResultsPageProps) {
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const [studentPrincipal, setStudentPrincipal] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Principal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingResult, setEditingResult] = useState<TestResult | null>(null);

  const { data: results, isLoading: resultsLoading } = useGetTestResultsFor(selectedStudent);
  const deleteTestResult = useDeleteTestResult();

  const isAdmin = userRole === UserRole.admin;

  // Sort results by date (most recent first)
  const sortedResults = results ? [...results].sort((a, b) => {
    return Number(b.examDate) - Number(a.examDate);
  }) : [];

  const handleLoadStudent = () => {
    try {
      const principal = Principal.fromText(studentPrincipal.trim());
      setSelectedStudent(principal);
    } catch (error) {
      alert('Invalid principal ID format');
    }
  };

  const handleDelete = async (examName: string) => {
    if (!selectedStudent) return;
    if (!confirm(`Are you sure you want to delete the test result for "${examName}"?`)) return;

    try {
      await deleteTestResult.mutateAsync({ student: selectedStudent, examName });
    } catch (error: any) {
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const handleEdit = (result: TestResult) => {
    setEditingResult(result);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingResult(null);
    setShowForm(true);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month},${year}`;
  };

  if (roleLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied: Only administrators can access this page.
          </AlertDescription>
        </Alert>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#0F5FC2] text-white px-4 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Admin - Manage Test Results</h1>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Student Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter student Principal ID"
                  value={studentPrincipal}
                  onChange={(e) => setStudentPrincipal(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleLoadStudent}>Load Student</Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Results Management */}
          {selectedStudent && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Test Results</CardTitle>
                <Button onClick={handleAddNew} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Test Result
                </Button>
              </CardHeader>
              <CardContent>
                {resultsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  </div>
                ) : sortedResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No test results found for this student
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border px-3 py-2 text-left text-sm font-semibold">Exam Name / Date</th>
                          <th className="border px-3 py-2 text-center text-sm font-semibold">Total</th>
                          <th className="border px-3 py-2 text-center text-sm font-semibold">%</th>
                          <th className="border px-3 py-2 text-center text-sm font-semibold">Rank</th>
                          <th className="border px-3 py-2 text-center text-sm font-semibold">Global Rank</th>
                          <th className="border px-3 py-2 text-center text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedResults.map((result, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}>
                            <td className="border px-3 py-2">
                              <div className="font-medium">{result.examName}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{formatDate(result.examDate)}</span>
                                {result.hasAttachment && (
                                  <Paperclip className="h-3 w-3 text-orange-500" />
                                )}
                              </div>
                            </td>
                            <td className="border px-3 py-2 text-center">{result.totalMarks}</td>
                            <td className="border px-3 py-2 text-center">
                              {result.percentage === 0 ? '0' : result.percentage.toFixed(2)}
                            </td>
                            <td className="border px-3 py-2 text-center">
                              {result.rank ? Number(result.rank) : '0'}
                            </td>
                            <td className="border px-3 py-2 text-center">
                              {formatGlobalRank(result.globalRank)}
                            </td>
                            <td className="border px-3 py-2">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(result)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(result.examName)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Form Dialog */}
      {showForm && (
        <TestResultForm
          student={selectedStudent!}
          existingResult={editingResult}
          onClose={() => {
            setShowForm(false);
            setEditingResult(null);
          }}
        />
      )}
    </div>
  );
}

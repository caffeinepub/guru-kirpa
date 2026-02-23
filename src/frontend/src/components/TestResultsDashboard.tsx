import { useGetTestResults } from '../hooks/useGetTestResults';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestResultsDashboardProps {
  onNavigateToReport: () => void;
}

export default function TestResultsDashboard({ onNavigateToReport }: TestResultsDashboardProps) {
  const { data: results, isLoading, error } = useGetTestResults();

  // Sort results by date (most recent first)
  const sortedResults = results ? [...results].sort((a, b) => {
    return Number(b.examDate) - Number(a.examDate);
  }) : [];

  const totalTests = sortedResults.length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6 w-full">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load test results. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 w-full">
      {/* Main Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={onNavigateToReport}
          size="lg"
          className="bg-[#FF8C00] hover:bg-[#FF7700] text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg"
        >
          <FileText className="h-6 w-6 mr-2" />
          Test Exam Report
        </Button>
      </div>

      {/* Statistics */}
      <div className="text-center">
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="text-5xl font-bold text-foreground">{totalTests}</div>
            </div>
            <p className="text-lg text-muted-foreground">
              Total Tests Completed
            </p>
          </CardContent>
        </Card>
      </div>

      {sortedResults.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No test results yet</h3>
            <p className="text-muted-foreground">
              Your test results will appear here once they are available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useGetTestResults } from '../hooks/useGetTestResults';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatGlobalRank } from '../utils/formatTestResult';

interface TestExamReportPageProps {
  onBack: () => void;
}

export default function TestExamReportPage({ onBack }: TestExamReportPageProps) {
  const { data: results, isLoading, error } = useGetTestResults();

  // Sort results by date (most recent first)
  const sortedResults = results ? [...results].sort((a, b) => {
    return Number(b.examDate) - Number(a.examDate);
  }) : [];

  // Format date from timestamp
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month},${year}`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="h-96 w-full max-w-6xl" />
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
    <div className="w-full h-full flex flex-col">
      {/* Blue Header */}
      <div className="bg-[#0F5FC2] text-white px-4 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Test Exam Report</h1>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#D3D3D3]">
              <th className="border border-gray-400 px-3 py-3 text-left text-sm font-semibold text-gray-800">
                <div>Exam Name</div>
                <div className="text-xs font-normal mt-1">Exam Date</div>
              </th>
              <th className="border border-gray-400 px-3 py-3 text-center text-sm font-semibold text-gray-800">
                Total
              </th>
              <th className="border border-gray-400 px-3 py-3 text-center text-sm font-semibold text-gray-800">
                %
              </th>
              <th className="border border-gray-400 px-3 py-3 text-center text-sm font-semibold text-gray-800">
                Rank
              </th>
              <th className="border border-gray-400 px-3 py-3 text-center text-sm font-semibold text-gray-800">
                Global Rank
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-gray-400 px-3 py-8 text-center text-gray-500">
                  No test results available
                </td>
              </tr>
            ) : (
              sortedResults.map((result, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-[#F5F5F5]' : 'bg-white'}>
                  <td className="border border-gray-400 px-3 py-3">
                    <div className="font-medium text-gray-900">{result.examName}</div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <span>{formatDate(result.examDate)}</span>
                      {result.hasAttachment && (
                        <Paperclip className="h-4 w-4 text-[#FF8C00]" />
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-400 px-3 py-3 text-center text-gray-900">
                    {result.totalMarks}
                  </td>
                  <td className="border border-gray-400 px-3 py-3 text-center text-gray-900">
                    {result.percentage === 0 ? '0' : result.percentage.toFixed(2)}
                  </td>
                  <td className="border border-gray-400 px-3 py-3 text-center text-gray-900">
                    {result.rank ? Number(result.rank) : '0'}
                  </td>
                  <td className="border border-gray-400 px-3 py-3 text-center text-gray-900">
                    {formatGlobalRank(result.globalRank)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

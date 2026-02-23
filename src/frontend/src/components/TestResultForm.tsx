import { useState, useEffect } from 'react';
import { useCreateTestResult, useUpdateTestResult } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import type { Principal } from '@dfinity/principal';
import type { TestResult } from '../backend';

interface TestResultFormProps {
  student: Principal;
  existingResult?: TestResult | null;
  onClose: () => void;
}

export default function TestResultForm({ student, existingResult, onClose }: TestResultFormProps) {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [totalScored, setTotalScored] = useState('');
  const [totalMaximum, setTotalMaximum] = useState('');
  const [percentage, setPercentage] = useState('');
  const [rank, setRank] = useState('');
  const [globalRank, setGlobalRank] = useState('');
  const [hasAttachment, setHasAttachment] = useState(false);
  const [error, setError] = useState('');

  const createMutation = useCreateTestResult();
  const updateMutation = useUpdateTestResult();

  const isEditing = !!existingResult;

  useEffect(() => {
    if (existingResult) {
      setExamName(existingResult.examName);
      
      // Convert timestamp to date string
      const date = new Date(Number(existingResult.examDate) / 1000000);
      setExamDate(date.toISOString().split('T')[0]);
      
      // Parse totalMarks
      const [scored, maximum] = existingResult.totalMarks.split('/');
      setTotalScored(scored);
      setTotalMaximum(maximum);
      
      setPercentage(existingResult.percentage.toString());
      setRank(existingResult.rank ? existingResult.rank.toString() : '');
      setGlobalRank(existingResult.globalRank ? existingResult.globalRank.toString() : 'NA');
      setHasAttachment(existingResult.hasAttachment);
    }
  }, [existingResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const scored = parseInt(totalScored);
    const maximum = parseInt(totalMaximum);

    if (isNaN(scored) || isNaN(maximum)) {
      setError('Total scored and maximum must be valid numbers');
      return;
    }

    if (scored > maximum) {
      setError('Total scored cannot exceed total maximum');
      return;
    }

    // Calculate percentage if not provided
    let percentageValue = parseFloat(percentage);
    if (!percentage || isNaN(percentageValue)) {
      percentageValue = maximum > 0 ? (scored / maximum) * 100 : 0;
    }

    // Convert date to nanoseconds timestamp
    const dateObj = new Date(examDate);
    const timestamp = BigInt(dateObj.getTime() * 1000000);

    const testResult: TestResult = {
      examName,
      examDate: timestamp,
      totalMarks: `${scored}/${maximum}`,
      percentage: percentageValue,
      rank: rank ? BigInt(parseInt(rank)) : undefined,
      globalRank: globalRank && globalRank !== 'NA' ? BigInt(parseInt(globalRank)) : undefined,
      hasAttachment,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          student,
          examName: existingResult!.examName,
          updatedResult: testResult,
        });
      } else {
        await createMutation.mutateAsync({ student, testResult });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save test result');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Test Result' : 'Add New Test Result'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examName">Exam Name *</Label>
              <Input
                id="examName"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date *</Label>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalScored">Total Scored *</Label>
              <Input
                id="totalScored"
                type="number"
                value={totalScored}
                onChange={(e) => setTotalScored(e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMaximum">Total Maximum *</Label>
              <Input
                id="totalMaximum"
                type="number"
                value={totalMaximum}
                onChange={(e) => setTotalMaximum(e.target.value)}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage (auto-calculated if empty)</Label>
              <Input
                id="percentage"
                type="number"
                step="0.01"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rank">Rank</Label>
              <Input
                id="rank"
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="globalRank">Global Rank (or 'NA')</Label>
              <Input
                id="globalRank"
                value={globalRank}
                onChange={(e) => setGlobalRank(e.target.value)}
                placeholder="Enter number or 'NA'"
              />
            </div>

            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAttachment"
                  checked={hasAttachment}
                  onCheckedChange={(checked) => setHasAttachment(checked as boolean)}
                />
                <Label htmlFor="hasAttachment" className="cursor-pointer">
                  Has Attachment
                </Label>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { BookOpen, Award, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginScreen() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground tracking-tight">
            Welcome to Guru Kirpa
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access your test results and track your academic progress. Login to view your personalized dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">View Results</h3>
              <p className="text-sm text-muted-foreground">Access all your test scores</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Track Performance</h3>
              <p className="text-sm text-muted-foreground">Monitor your progress</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Detailed Insights</h3>
              <p className="text-sm text-muted-foreground">Subject-wise breakdown</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Secure Access</h3>
              <p className="text-sm text-muted-foreground">Your data is protected</p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Click the <span className="font-semibold text-foreground">Login</span> button above to get started
          </p>
        </div>
      </div>
    </div>
  );
}

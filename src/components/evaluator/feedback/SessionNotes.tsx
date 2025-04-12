
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SessionNotesProps {
  notes: string;
}

export const SessionNotes = ({ notes }: SessionNotesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Session Notes</CardTitle>
        <CardDescription>
          General notes about the overall session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{notes}</p>
      </CardContent>
    </Card>
  );
};

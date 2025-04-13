
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface SessionNotesProps {
  notes: string;
}

export const SessionNotes = ({ notes }: SessionNotesProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-speakspace-evaluator/20 to-speakspace-evaluator/5 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-speakspace-evaluator/30 p-2.5 shadow-sm">
            <MessageSquare className="h-5 w-5 text-speakspace-evaluator" />
          </div>
          <div>
            <CardTitle className="text-lg font-medium">Session Notes</CardTitle>
            <CardDescription className="text-sm">
              General notes about the overall session
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50">
        {notes ? (
          <div className="text-sm leading-relaxed">
            {notes.split('\n').map((paragraph, index) => (
              <p key={index} className={index > 0 ? 'mt-4' : ''}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-muted-foreground">No session notes available</p>
        )}
      </CardContent>
    </Card>
  );
};

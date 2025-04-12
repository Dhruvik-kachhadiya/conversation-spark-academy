import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, Clock, MessageSquare, FileText, User, Star, Download } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';

const mockFeedbackData = {
  sessionId: '3',
  sessionTitle: 'Leadership Skills Assessment',
  sessionTopic: 'Management',
  sessionType: 'Group Discussion',
  date: '2025-04-10T15:00:00',
  duration: 90,
  moderator: {
    name: 'John Moderator',
    id: '1'
  },
  participantCount: 5,
  evaluations: [
    {
      participantId: '2',
      participantName: 'Jane Participant',
      participantImage: 'https://ui-avatars.com/api/?name=Jane+Participant&background=10B981&color=fff',
      ratings: {
        communication: 8.5,
        confidence: 7.5,
        reasoning: 9.0,
        engagement: 8.0,
        overall: 8.3
      },
      notes: 'Jane demonstrated excellent communication skills and logical reasoning. Her arguments were well-structured and she frequently referenced data to support her points.',
      submittedAt: '2025-04-10T16:45:00'
    },
    {
      participantId: '5',
      participantName: 'Michael Smith',
      participantImage: 'https://ui-avatars.com/api/?name=Michael+Smith&background=10B981&color=fff',
      ratings: {
        communication: 7.0,
        confidence: 8.5,
        reasoning: 7.5,
        engagement: 9.0,
        overall: 8.0
      },
      notes: 'Michael showed great enthusiasm and was highly engaged throughout the discussion. He could improve on his communication clarity, but his confidence was notable.',
      submittedAt: '2025-04-10T16:47:00'
    },
    {
      participantId: '6',
      participantName: 'Sarah Johnson',
      participantImage: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff',
      ratings: {
        communication: 9.0,
        confidence: 6.5,
        reasoning: 8.5,
        engagement: 7.0,
        overall: 7.8
      },
      notes: 'Sarah was very articulate and presented well-reasoned arguments. She could work on her confidence and engage more consistently throughout the discussion.',
      submittedAt: '2025-04-10T16:50:00'
    },
    {
      participantId: '7',
      participantName: 'David Brown',
      participantImage: 'https://ui-avatars.com/api/?name=David+Brown&background=10B981&color=fff',
      ratings: {
        communication: 6.5,
        confidence: 7.0,
        reasoning: 8.0,
        engagement: 6.0,
        overall: 6.9
      },
      notes: 'David showed good reasoning skills but should work on his overall engagement and communication clarity. He had some strong points but didn\'t present them confidently.',
      submittedAt: '2025-04-10T16:55:00'
    },
    {
      participantId: '8',
      participantName: 'Emily Wilson',
      participantImage: 'https://ui-avatars.com/api/?name=Emily+Wilson&background=10B981&color=fff',
      ratings: {
        communication: 8.0,
        confidence: 8.0,
        reasoning: 7.0,
        engagement: 7.5,
        overall: 7.6
      },
      notes: 'Emily was well-balanced across all areas. She communicated clearly and showed good confidence. Could improve slightly on the depth of her reasoning.',
      submittedAt: '2025-04-10T17:00:00'
    }
  ],
  sessionNotes: 'Overall, this was a productive group discussion with active participation from most members. The group showed good dynamics, though there were a few instances where more structure would have helped. The topic was explored comprehensively with diverse perspectives shared.'
};

const FeedbackHistory = () => {
  const { sessionId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState(mockFeedbackData);
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getAverageRatings = () => {
    const totals = {
      communication: 0,
      confidence: 0,
      reasoning: 0,
      engagement: 0
    };
    
    feedbackData.evaluations.forEach(evaluation => {
      totals.communication += evaluation.ratings.communication;
      totals.confidence += evaluation.ratings.confidence;
      totals.reasoning += evaluation.ratings.reasoning;
      totals.engagement += evaluation.ratings.engagement;
    });
    
    const count = feedbackData.evaluations.length;
    
    return {
      communication: parseFloat((totals.communication / count).toFixed(1)),
      confidence: parseFloat((totals.confidence / count).toFixed(1)),
      reasoning: parseFloat((totals.reasoning / count).toFixed(1)),
      engagement: parseFloat((totals.engagement / count).toFixed(1)),
      overall: parseFloat(((totals.communication + totals.confidence + totals.reasoning + totals.engagement) / (count * 4)).toFixed(1))
    };
  };
  
  const averageRatings = getAverageRatings();
  
  const pieChartData = [
    { name: 'Communication', value: averageRatings.communication, color: '#10B981' },
    { name: 'Confidence', value: averageRatings.confidence, color: '#3B82F6' },
    { name: 'Reasoning', value: averageRatings.reasoning, color: '#8B5CF6' },
    { name: 'Engagement', value: averageRatings.engagement, color: '#F59E0B' }
  ];
  
  const exportFeedback = () => {
    console.log('Exporting feedback');
    toast({
      title: "Success",
      description: "Feedback exported successfully",
    });
  };
  
  if (!currentUser || currentUser.role !== 'evaluator') {
    return (
      <MainLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You need to be logged in as an evaluator to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate('/login')}>
                Log in as Evaluator
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/evaluator/sessions')} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sessions</span>
          </Button>
          
          <Button onClick={exportFeedback} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Feedback
          </Button>
        </div>
        
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Feedback History: {feedbackData.sessionTitle}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{feedbackData.sessionType}</Badge>
            <span className="text-muted-foreground">
              Topic: {feedbackData.sessionTopic}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(feedbackData.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{feedbackData.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Moderator: {feedbackData.moderator.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span>Participants: {feedbackData.participantCount}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Average Ratings
              </CardTitle>
              <CardDescription>
                Overall session performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 10).toFixed(1)}`}
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Average:</span>
                  <span className="text-xl font-bold">{averageRatings.overall}/10</span>
                </div>
                <Separator className="my-2" />
                <div className="space-y-2 mt-3">
                  {pieChartData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-sm">{category.name}:</span>
                      </div>
                      <span className="font-medium">{category.value}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Participant Evaluations
              </CardTitle>
              <CardDescription>
                Individual feedback provided to each participant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead className="text-center">Overall</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Communication</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Confidence</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">Reasoning</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackData.evaluations.map((evaluation) => (
                    <TableRow key={evaluation.participantId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img 
                            src={evaluation.participantImage}
                            alt={evaluation.participantName}
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="font-medium">{evaluation.participantName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{evaluation.ratings.overall}</TableCell>
                      <TableCell className="hidden md:table-cell text-center">{evaluation.ratings.communication}</TableCell>
                      <TableCell className="hidden md:table-cell text-center">{evaluation.ratings.confidence}</TableCell>
                      <TableCell className="hidden lg:table-cell text-center">{evaluation.ratings.reasoning}</TableCell>
                      <TableCell className="hidden lg:table-cell text-center">{evaluation.ratings.engagement}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Individual Feedback Notes</CardTitle>
            <CardDescription>
              Detailed feedback provided to each participant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {feedbackData.evaluations.map((evaluation) => (
              <div key={evaluation.participantId} className="p-4 rounded-lg border">
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={evaluation.participantImage}
                    alt={evaluation.participantName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{evaluation.participantName}</h3>
                      <Badge className="bg-speakspace-evaluator text-white">
                        {evaluation.ratings.overall}/10
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Feedback submitted at {formatDate(evaluation.submittedAt)}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm mb-4">{evaluation.notes}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                    <span className="text-xs text-muted-foreground">Communication</span>
                    <span className="font-bold">{evaluation.ratings.communication}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <span className="font-bold">{evaluation.ratings.confidence}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                    <span className="text-xs text-muted-foreground">Reasoning</span>
                    <span className="font-bold">{evaluation.ratings.reasoning}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                    <span className="text-xs text-muted-foreground">Engagement</span>
                    <span className="font-bold">{evaluation.ratings.engagement}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Notes</CardTitle>
            <CardDescription>
              General notes about the overall session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{feedbackData.sessionNotes}</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FeedbackHistory;

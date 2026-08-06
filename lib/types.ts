export interface DashboardTask {
  id: number;
  topic: string;
  subject: string;
  activity: string;
  duration: number;
  notes: string;
  is_done: boolean;
  student_remarks: string;
  confidence_level: string;
  difficulty_level: string;
}

export interface DashboardData {
  profile: {
    id: number;
    name: string;
    registration_no: string;
    batch: string;
    mentor: string;
  };
  metrics: {
    learning_score: number;
    attendance: number;
    overall_completion: number;
    weak_topic_count: number;
    mastered_topic_count: number;
    score_completion: number;
    score_attendance: number;
    score_practice: number;
    score_test_marks: number;
    score_revision: number;
    score_consistency: number;
  };
  today_plan: {
    id: number;
    state: string;
    tasks: DashboardTask[];
  } | null;
  weekly_hours: { date: string; allocated: number; completed: number }[];
  weak_topics: { id: number; topic: string }[];
  strong_topics: { id: number; topic: string }[];
  upcoming_exams: { id: number; name: string; exam_date: string; days_left: number }[];
  quizzes: {
    id: number;
    name: string;
    has_attempted: boolean;
    grade: number;
    max_grade: number;
    percentage: number;
    moodle_url: string;
  }[];
  activities: {
    id: number;
    name: string;
    type: string;
    section: string;
    due_date: string;
    moodle_url: string;
    is_complete: boolean;
    is_tracked: boolean;
  }[];
  doubts: {
    id: number;
    description: string;
    status: string;
    topic: string;
    mentor_reply: string;
    created: string;
  }[];
  quote: string;
}

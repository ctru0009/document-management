interface Attachment {
  id: number;
  name: string;
}

interface Submission {
  id: number;
  ctime: string;
  totalMarks: number;
  attachments: Attachment[];
  authors: User[];
  results: any[];
  feedback: any | null;
}

interface User {
  id: number;
  name: string;
}

interface Data {
  id: number;
  name: string;
  ctime: string;
  rubric: Attachment;
  owner: User;
  minMarks: number;
  maxMarks: number;
  submissions: Submission[];
}
interface ResultCreate {
  value: number;
  criterion: number;
}

interface MarksCreate {
  results: ResultCreate[];
  feedback: string | null;
}

interface CriterionRead {
  id: number;
  name: string;
  minMarks: number;
  maxMarks: number;
}

interface CriterionCreate {
  name: string;
  min: number;
  max: number;
}

interface Document {
  id: number;
  name: string;
  type: string;
  ctime: string;
  size: number;
  owner: User;
  downloadURL: string;
}

interface Criteria {
  name: string;
  min: number;
  max: number;
  assessment_id: number;
}

export type {
  Attachment,
  Submission,
  User as Owner,
  Data,
  ResultCreate,
  MarksCreate,
  CriterionRead,
  Document,
  Criteria,
  CriterionCreate,
};

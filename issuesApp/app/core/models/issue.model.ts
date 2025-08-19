import { IssuePriorityEnum } from "../enum/IssuePriorityEnum";
import { IssueStatusEnum } from "../enum/IssueStatusEnum";



export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatusEnum;
  priority: IssuePriorityEnum;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssuesFilter {
  search?: string;
  status?: IssueStatusEnum | '';
  page?: number;
  limit?: number;
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  status: IssueStatusEnum;
  priority: IssuePriorityEnum;
  assignee: string;
}

export interface UpdateIssueRequest extends Partial<CreateIssueRequest> {
  id: number;
}


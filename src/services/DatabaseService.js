import { v4 as uuidv4 } from 'uuid';

// Mock Database Service using LocalStorage
// Simulates Firestore for immediate hackathon demo capability

const ISSUES_KEY = 'civiclens_issues';
const USERS_KEY = 'civiclens_users';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const DatabaseService = {
  // Initialize mock data if empty
  init: () => {
    if (!localStorage.getItem(ISSUES_KEY)) {
      localStorage.setItem(ISSUES_KEY, JSON.stringify([]));
    }
  },

  getAllIssues: async () => {
    await delay(300); // simulate network
    return JSON.parse(localStorage.getItem(ISSUES_KEY)) || [];
  },

  getIssueById: async (id) => {
    await delay(200);
    const issues = await DatabaseService.getAllIssues();
    return issues.find(i => i.id === id);
  },

  addIssue: async (issueData) => {
    await delay(500);
    const issues = await DatabaseService.getAllIssues();
    const newIssue = {
      ...issueData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      status: 'reported',
      // default priorities handled by ScoringEngine before saving
    };
    issues.push(newIssue);
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
    return newIssue.id;
  },

  updateIssue: async (id, updates) => {
    await delay(300);
    const issues = await DatabaseService.getAllIssues();
    const index = issues.findIndex(i => i.id === id);
    if (index > -1) {
      issues[index] = { ...issues[index], ...updates };
      localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
      return issues[index];
    }
    throw new Error('Issue not found');
  },

  upvoteIssue: async (id) => {
    const issues = await DatabaseService.getAllIssues();
    const index = issues.findIndex(i => i.id === id);
    if (index > -1) {
      issues[index].upvotes += 1;
      // Note: priority score would need recalculation here ideally
      localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
      return issues[index];
    }
    throw new Error('Issue not found');
  }
};

DatabaseService.init();

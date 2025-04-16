// defaultTasks.js - Default tasks for initial load or refresh

export default [
  {
    id: 1,
    name: 'Plan Team Strategy',
    description: 'Develop a comprehensive strategy for the upcoming game.',
    public: true,
    dueDate: '3 days',
    completed: false,
    following: false,
    important: true,
    urgent: false,
    rating: 4,
    helpsWin: 3
  },
  {
    id: 2,
    name: 'Review Player Performance',
    description: 'Analyze recent player stats and performance videos.',
    public: false,
    dueDate: '1 week',
    completed: false,
    following: false,
    important: false,
    urgent: false,
    rating: 3,
    helpsWin: 1
  },
  {
    id: 3,
    name: 'Organize Training Session',
    description: 'Schedule and prepare drills for the next training session.',
    public: true,
    dueDate: '1 day',
    completed: false,
    following: true,
    important: true,
    urgent: true,
    rating: 5,
    helpsWin: 5
  },
  {
    id: 4,
    name: 'Update Playbook',
    description: 'Incorporate new plays into the team playbook.',
    public: false,
    dueDate: 'longer than 1 week',
    completed: false,
    following: false,
    important: false,
    urgent: false,
    rating: 2,
    helpsWin: 0
  },
  {
    id: 5,
    name: 'Scout Opponents',
    description: 'Gather information on the next opponent\'s tactics.',
    public: false,
    dueDate: '4 hours',
    completed: false,
    following: false,
    important: true,
    urgent: true,
    rating: 4,
    helpsWin: 2
  }
];

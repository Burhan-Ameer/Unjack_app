export const friends = [
  { id: '1', name: 'Ali',  username: '@ali',  streak: '6 days', rank: 1, avatar: 'https://i.pravatar.cc/150?u=ali'  },
  { id: '2', name: 'Sara', username: '@sara', streak: '5 days', rank: 2, avatar: 'https://i.pravatar.cc/150?u=sara' },
  { id: '3', name: 'John', username: '@john', streak: '4 days', rank: 3, avatar: 'https://i.pravatar.cc/150?u=john' },
  { id: '4', name: 'Mike', username: '@mike', streak: '2 days', rank: 4, avatar: 'https://i.pravatar.cc/150?u=mike' },
  { id: '5', name: 'Lisa', username: '@lisa', streak: '1 day',  rank: 5, avatar: 'https://i.pravatar.cc/150?u=lisa' },
];

export const blockedApps = [
  { id: '1', name: 'Instagram', packageName: 'com.instagram.android',      icon: 'camera',  isBlocked: true  },
  { id: '2', name: 'TikTok',    packageName: 'com.zhiliaoapp.musically',    icon: 'music',   isBlocked: true  },
  { id: '3', name: 'Twitter',   packageName: 'com.twitter.android',         icon: 'twitter', isBlocked: false },
  { id: '4', name: 'YouTube',   packageName: 'com.google.android.youtube',  icon: 'video',   isBlocked: true  },
];

export const schedules = [
  { id: '1', name: 'Work Hours',  startTime: '09:00', endTime: '17:00', days: [1,2,3,4,5], isActive: true,  appIds: ['1','2','4'] },
  { id: '2', name: 'Deep Focus',  startTime: '19:00', endTime: '21:00', days: [1,3,5],     isActive: false, appIds: ['1','2','3','4'] },
];

export const stats = {
  blockTime:        '3h 12m',
  usageSaved:       '1h 45m',
  longestStreak:    '14 days',
  sessionsThisWeek: 12,
  chartData: [
    { date: '27 Jun', blockTime: 0.8, usageSaved: 0.4 },
    { date: '28 Jun', blockTime: 0.6, usageSaved: 0.3 },
    { date: '29 Jun', blockTime: 0.9, usageSaved: 0.5 },
    { date: '30 Jun', blockTime: 0.7, usageSaved: 0.4 },
    { date: '01 Jul', blockTime: 0.5, usageSaved: 0.2 },
    { date: '02 Jul', blockTime: 0.8, usageSaved: 0.6 },
    { date: '03 Jul', blockTime: 0.4, usageSaved: 0.1 },
  ],
};

export const globalLeaderboard = [
  { id: '1', name: 'Emma',    username: '@emma',    streak: '30 days', rank: 1, avatar: 'https://i.pravatar.cc/150?u=emma'    },
  { id: '2', name: 'Liam',    username: '@liam',    streak: '28 days', rank: 2, avatar: 'https://i.pravatar.cc/150?u=liam'    },
  { id: '3', name: 'Olivia',  username: '@olivia',  streak: '25 days', rank: 3, avatar: 'https://i.pravatar.cc/150?u=olivia'  },
  { id: '4', name: 'Noah',    username: '@noah',    streak: '20 days', rank: 4, avatar: 'https://i.pravatar.cc/150?u=noah'    },
  { id: '5', name: 'Ava',     username: '@ava',     streak: '18 days', rank: 5, avatar: 'https://i.pravatar.cc/150?u=ava'     },
  { id: '6', name: 'William', username: '@william', streak: '15 days', rank: 6, avatar: 'https://i.pravatar.cc/150?u=william' },
];

export const userProfile = {
  name:          'Ali',
  username:      '@ali',
  streak:        '14h 32m',
  friendsCount:  24,
  longestStreak: '14 days',
  achievements: [
    { id: '1', name: 'Early Bird',      description: 'Start a session before 8am',     icon: 'sunrise'  },
    { id: '2', name: 'Night Owl',       description: 'Complete a session after 10pm',  icon: 'moon'     },
    { id: '3', name: 'Weekend Warrior', description: 'Complete 5 sessions on weekends', icon: 'calendar' },
  ],
};

export const notifications = [
  {
    id: '1',
    type: 'streak',
    title: '7-Day Streak! 🔥',
    body: "You've completed 7 days in a row. Keep it up!",
    timestamp: '2m ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'friend_activity',
    title: 'Sara started a session',
    body: 'Sara just kicked off a Deep Focus session.',
    timestamp: '14m ago',
    isRead: false,
    actorAvatar: 'https://i.pravatar.cc/150?u=sara',
  },
  {
    id: '3',
    type: 'friend_request',
    title: 'New friend request',
    body: 'Mike wants to connect with you.',
    timestamp: '1h ago',
    isRead: false,
    actorAvatar: 'https://i.pravatar.cc/150?u=mike',
  },
  {
    id: '4',
    type: 'weekly_summary',
    title: 'Your weekly report is ready',
    body: 'You blocked 18h 42m of distractions this week.',
    timestamp: '3h ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Achievement unlocked!',
    body: 'You earned the "Night Owl" badge.',
    timestamp: 'Yesterday',
    isRead: true,
  },
  {
    id: '6',
    type: 'friend_activity',
    title: 'John topped the leaderboard',
    body: 'John just moved to #1 in your friends list.',
    timestamp: 'Yesterday',
    isRead: true,
    actorAvatar: 'https://i.pravatar.cc/150?u=john',
  },
];

export const sessionHistory = [
  { id: '1', scheduleName: 'Work Hours',  date: 'Today',      startTime: '09:00', endTime: '11:30', duration: '2h 30m', appsBlocked: 3, timeSaved: '1h 12m' },
  { id: '2', scheduleName: 'Deep Focus',  date: 'Today',      startTime: '19:00', endTime: '20:15', duration: '1h 15m', appsBlocked: 4, timeSaved: '48m'    },
  { id: '3', scheduleName: 'Work Hours',  date: 'Yesterday',  startTime: '09:00', endTime: '17:00', duration: '8h 00m', appsBlocked: 3, timeSaved: '3h 05m' },
  { id: '4', scheduleName: 'Deep Focus',  date: 'Yesterday',  startTime: '20:00', endTime: '21:00', duration: '1h 00m', appsBlocked: 4, timeSaved: '40m'    },
  { id: '5', scheduleName: 'Work Hours',  date: 'Mon, 7 Jul', startTime: '09:00', endTime: '13:00', duration: '4h 00m', appsBlocked: 3, timeSaved: '1h 50m' },
];

export const appSettings = {
  notifications: {
    streakReminders:  true,
    friendActivity:   true,
    weeklyReport:     true,
    sessionStart:     false,
  },
  behavior: {
    defaultDuration:  25,   // minutes
    gracePeriod:      5,    // minutes
    strictMode:       false,
  },
  privacy: {
    profileVisibility: 'friends' as 'friends' | 'global' | 'private',
    shareStats:        true,
  },
};

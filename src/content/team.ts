export type TeamMember = { name: string; studentId: string; photo?: string; initials: string; objectPosition?: string; photoTransform?: string };

export const team: TeamMember[] = [
  { name: 'Shifa Akter Mim', studentId: '111221166', photo: '/team/shifa-akter-mim.jpg', initials: 'SM', objectPosition: 'center 36%', photoTransform: 'scale(2.8) translate(-5%, 12%)' },
  { name: 'Asif Hossain', studentId: '111221086', photo: '/team/asif-hossain.jpg', initials: 'AH', objectPosition: 'center 35%' },
  { name: 'Tanzir Ahsan Shakib', studentId: '1112230189', photo: '/team/tanzir-ahsan-shakib.jpg', initials: 'TS', objectPosition: 'center 36%' },
  { name: 'Md. Nahidul Islam', studentId: '1112230203', photo: '/team/md-nahidul-islam.jpg', initials: 'NI', objectPosition: 'center 32%' }
];

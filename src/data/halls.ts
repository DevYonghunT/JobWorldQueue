import type { HallInfo, InterestTypeInfo } from './types';

export const halls: HallInfo[] = [
  {
    id: 'children', name: '어린이체험관', nameEn: 'Children',
    color: '#F5A623', icon: 'baby',
    ageRange: '4~13세', roomCount: '42개 체험실',
    session1: { start: '09:30', end: '13:30' },
    session2: { start: '14:30', end: '18:30' },
  },
  {
    id: 'youth', name: '청소년체험관', nameEn: 'Youth',
    color: '#4A90D9', icon: 'graduation-cap',
    ageRange: '10~19세', roomCount: '40개 체험실',
    session1: { start: '09:30', end: '13:30' },
    session2: { start: '14:30', end: '18:30' },
  },
  {
    id: 'future', name: '미래직업관', nameEn: 'Future',
    color: '#1E3A5F', icon: 'rocket',
    ageRange: '14세 이상', roomCount: '15개 체험실',
    session1: { start: '09:30', end: '13:30' },
    session2: { start: '14:30', end: '18:30' },
  },
  {
    id: 'skills', name: '숙련기술체험관', nameEn: 'Skills',
    color: '#2E7D32', icon: 'wrench',
    ageRange: '10세 이상', roomCount: '20개 체험실',
    session1: { start: '09:30', end: '13:30' },
    session2: { start: '14:30', end: '18:30' },
  },
  {
    id: 'career', name: '진로설계관', nameEn: 'Career',
    color: '#E91E63', icon: 'compass',
    ageRange: '14세 이상', roomCount: '10개 체험실',
    session1: { start: '09:30', end: '13:30' },
    session2: { start: '14:30', end: '18:30' },
  },
  {
    id: 'makers', name: '메카이브', nameEn: 'Makers',
    color: '#9C27B0', icon: 'blocks',
    ageRange: '10세 이상', roomCount: '8개 체험실',
    session1: { start: '09:30', end: '13:30' },
    session2: { start: '14:30', end: '18:30' },
  },
];

export const interestTypes: Record<string, InterestTypeInfo> = {
  R: { code: 'R', name: '실재형', fullName: 'Realistic', color: '#2E7D32', bg: '#E8F5E9' },
  I: { code: 'I', name: '탐구형', fullName: 'Investigative', color: '#1565C0', bg: '#E3F2FD' },
  A: { code: 'A', name: '예술형', fullName: 'Artistic', color: '#9C27B0', bg: '#F3E5F5' },
  S: { code: 'S', name: '사회형', fullName: 'Social', color: '#E91E63', bg: '#FCE4EC' },
  E: { code: 'E', name: '진취형', fullName: 'Enterprising', color: '#F5A623', bg: '#FFF8E1' },
  C: { code: 'C', name: '관습형', fullName: 'Conventional', color: '#607D8B', bg: '#ECEFF1' },
};

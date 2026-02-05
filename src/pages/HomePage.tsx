import { useNavigate } from 'react-router-dom';
import { Bell, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { halls, hallsWithData, getHallRoomCount, getHallColor } from '../data/halls';
import { rooms } from '../data/rooms';
import { HALL_ICONS } from '../data/constants';
import { getAvailableRooms } from '../utils/schedule';
import { getCurrentSession, getRemainingTime, formatTimeDisplay } from '../utils/time';
import { AdBanner } from '../components/AdBanner';

export function HomePage() {
  const navigate = useNavigate();
  const { currentTime, selectedSession, setSelectedHall } = useAppStore();

  // Time ticker is now managed in Layout component

  const session = getCurrentSession(currentTime) || selectedSession;
  const available = getAvailableRooms(rooms, currentTime, session);
  const remainingTime = getRemainingTime(currentTime, session);
  const displayTime = formatTimeDisplay(currentTime);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-[24px] pt-[14px] pb-[0px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <h1 className="font-display text-[28px] font-bold text-[var(--color-text-primary)]">
              한국잡월드
            </h1>
            <p className="text-[14px] text-[var(--color-text-secondary)]">
              시간표 & 코스 플래너
            </p>
          </div>
          <button
            type="button"
            aria-label="알림"
            className="w-[48px] h-[48px] bg-[var(--color-surface)] rounded-[24px] flex items-center justify-center"
          >
            <Bell size={22} aria-hidden="true" className="text-[var(--color-text-primary)]" />
          </button>
        </div>
      </div>

      <div className="px-[24px] pt-[24px] pb-[24px] flex flex-col gap-[24px]">
        {/* Time Info Card */}
        <div className="w-full bg-[var(--color-accent)] rounded-[24px] p-[20px] flex items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[13px] font-medium text-white/70">현재 시간</span>
            <span className="font-display text-[28px] font-extrabold text-white">{displayTime}</span>
          </div>
          <div className="flex flex-col items-end gap-[4px]">
            <span className="text-[13px] font-medium text-white/70">{session}부 남은 시간</span>
            <span className="font-display text-[20px] font-bold text-white">{remainingTime}</span>
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner slot="home-top" />

        {/* Hall Selection */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">
            체험관 선택
          </h2>
          <div className="grid grid-cols-2 gap-[12px]">
            {halls.map((hall) => {
              const hasData = hallsWithData.has(hall.id);
              const roomCount = hasData ? getHallRoomCount(hall.id) : 0;
              return (
                <button
                  key={hall.id}
                  type="button"
                  onClick={() => {
                    if (hasData) {
                      setSelectedHall(hall.id);
                      navigate('/timetable');
                    }
                  }}
                  disabled={!hasData}
                  aria-label={hasData ? `${hall.name} 시간표 보기` : `${hall.name} - 준비 중`}
                  className={`flex flex-col gap-[8px] p-[20px_16px] rounded-[20px] text-left relative ${
                    !hasData ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ backgroundColor: hall.color }}
                >
                  <span aria-hidden="true" className="text-[28px]">{HALL_ICONS[hall.icon]}</span>
                  <span className="text-[16px] font-semibold text-white">{hall.name}</span>
                  <span className="text-[11px] text-white/70">
                    {hasData ? `${roomCount}개 체험실 | ${hall.ageRange}` : '준비 중'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">
            빠른 메뉴
          </h2>
          <div className="flex gap-[12px]">
            <button
              type="button"
              onClick={() => navigate('/course')}
              className="flex-1 flex items-center gap-[12px] px-[20px] py-[16px] bg-[var(--color-accent)] rounded-[24px]"
            >
              <Sparkles size={22} aria-hidden="true" className="text-white" />
              <span className="text-[15px] font-semibold text-white">스마트 코스 생성</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/timetable')}
              className="flex-1 flex items-center gap-[12px] px-[20px] py-[16px] bg-[var(--color-surface)] rounded-[24px]"
            >
              <Calendar size={22} aria-hidden="true" className="text-[var(--color-text-primary)]" />
              <span className="text-[15px] font-semibold text-[var(--color-text-primary)]">시간표 보기</span>
            </button>
          </div>
        </div>

        {/* Upcoming Experiences */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">
              다음 체험 일정
            </h2>
            <span className="px-[12px] py-[6px] bg-[#F5A62320] rounded-[20px] text-[13px] font-semibold text-[var(--color-accent)]">
              {available.length}개 체험실
            </span>
          </div>
          <div className="bg-[var(--color-surface)] rounded-[24px]">
            {available.slice(0, 3).map((room) => {
              const hallColor = getHallColor(room.hall);
              return (
                <div
                  key={room.id}
                  className="flex items-center gap-[14px] px-[20px] py-[16px]"
                >
                  <div
                    className="w-[10px] h-[10px] rounded-full shrink-0"
                    style={{ backgroundColor: hallColor }}
                  />
                  <div className="flex flex-col gap-[2px] flex-1">
                    <span className="text-[16px] font-semibold text-[var(--color-text-primary)]">
                      {room.name}
                    </span>
                    <span className="text-[13px] text-[var(--color-text-secondary)]">
                      {room.floor}층 | {room.duration}분 | {room.nextTime} 시작
                    </span>
                  </div>
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: hallColor }}
                  >
                    {room.joyCurrency > 0 ? '+' : ''}{room.joyCurrency} 조이
                  </span>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => navigate('/timetable')}
              className="w-full py-[14px] flex items-center justify-center gap-[4px]"
            >
              <span className="text-[14px] font-medium text-[var(--color-text-secondary)]">더보기</span>
              <ChevronRight size={16} aria-hidden="true" className="text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Bottom Ad */}
        <AdBanner slot="home-bottom" />
      </div>
    </div>
  );
}

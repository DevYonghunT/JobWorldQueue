import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { halls } from '../data/halls';
import { rooms } from '../data/rooms';
import { schedules } from '../data/schedules';
import type { DurationType } from '../data/types';
import { getAvailableRooms, getRoomsByDuration } from '../utils/schedule';
import { formatTimeDisplay } from '../utils/time';
import { AdBanner } from '../components/AdBanner';

export function TimetablePage() {
  const navigate = useNavigate();
  const { currentTime, selectedHall, selectedSession, setSelectedSession } = useAppStore();

  const currentHall = halls.find(h => h.id === selectedHall) ?? halls[0];
  const hallRooms = rooms.filter(r => r.hall === selectedHall);
  const available = getAvailableRooms(hallRooms, currentTime, selectedSession);
  const byDuration = getRoomsByDuration(hallRooms);

  return (
    <div className="flex flex-col">
      {/* Nav Bar */}
      <div className="flex items-center gap-[12px] px-[16px] py-[12px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기">
          <ChevronLeft size={28} aria-hidden="true" className="text-[var(--color-text-primary)]" />
        </button>
        <h1 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">
          {currentHall.name}
        </h1>
      </div>

      <div className="px-[24px] pb-[24px] flex flex-col gap-[24px]">
        {/* Session Toggle */}
        <div role="tablist" aria-label="부 선택" className="w-full h-[48px] bg-[var(--color-surface)] rounded-[24px] p-[4px] flex">
          <button
            type="button"
            role="tab"
            aria-selected={selectedSession === 1}
            onClick={() => setSelectedSession(1)}
            className={`flex-1 rounded-[20px] flex items-center justify-center text-[14px] font-semibold transition-colors ${
              selectedSession === 1
                ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-tertiary)]'
            }`}
          >
            1부 (09:30~13:30)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedSession === 2}
            onClick={() => setSelectedSession(2)}
            className={`flex-1 rounded-[20px] flex items-center justify-center text-[14px] font-semibold transition-colors ${
              selectedSession === 2
                ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-tertiary)]'
            }`}
          >
            2부 (14:30~18:30)
          </button>
        </div>

        {/* Current Time */}
        <div className="flex items-center gap-[8px]">
          <Clock size={16} className="text-[var(--color-text-secondary)]" />
          <span className="text-[14px] text-[var(--color-text-secondary)]">
            현재 시간: {formatTimeDisplay(currentTime)}
          </span>
        </div>

        {/* Available Now */}
        {available.length > 0 && (
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">
                지금 입장 가능
              </h2>
              <span
                className="px-[10px] py-[4px] rounded-[12px] text-[12px] font-semibold"
                style={{ backgroundColor: `${currentHall.color}20`, color: currentHall.color }}
              >
                {available.length}개
              </span>
            </div>
            <div className="bg-[var(--color-surface)] rounded-[20px] overflow-hidden">
              {available.slice(0, 5).map((room) => (
                <div
                  key={room.id}
                  className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-[var(--color-elevated)] last:border-b-0"
                >
                  <span className="text-[20px]">{room.icon}</span>
                  <div className="flex-1 flex flex-col gap-[2px]">
                    <span className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                      {room.name}
                    </span>
                    <span className="text-[12px] text-[var(--color-text-secondary)]">
                      {room.floor}층 | {room.duration}분
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-[2px]">
                    <span className="text-[13px] font-semibold" style={{ color: currentHall.color }}>
                      {room.nextTime}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-tertiary)]">
                      {room.joyCurrency > 0 ? '+' : ''}{room.joyCurrency} 조이
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ad Banner */}
        <AdBanner slot="timetable-mid" />

        {/* Rooms by Duration */}
        {Array.from(byDuration.entries()).map(([duration, durationRooms]) => {
          const schedule = schedules[duration as DurationType];
          const times = selectedSession === 1 ? schedule.times1 : schedule.times2;

          return (
            <div key={duration} className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">
                  {duration}분 체험
                </h2>
                <span className="text-[13px] text-[var(--color-text-secondary)]">
                  ({durationRooms.length}개)
                </span>
              </div>

              {/* Schedule times row */}
              <div className="overflow-x-auto -mx-[24px] px-[24px]">
                <div className="flex gap-[8px]">
                  {times.map(time => (
                    <span
                      key={time}
                      className="shrink-0 px-[12px] py-[6px] rounded-[12px] text-[12px] font-medium"
                      style={{ backgroundColor: `${currentHall.color}15`, color: currentHall.color }}
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* Room list */}
              <div className="bg-[var(--color-surface)] rounded-[20px] overflow-hidden">
                {durationRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-[12px] px-[16px] py-[12px] border-b border-[var(--color-elevated)] last:border-b-0"
                  >
                    <span className="text-[18px]">{room.icon}</span>
                    <div className="flex-1 flex flex-col gap-[1px]">
                      <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                        {room.name}
                      </span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">
                        {room.floor}층 · #{room.mapNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      {room.isPopular && (
                        <span className="px-[8px] py-[2px] bg-[#F5A62320] rounded-[8px] text-[11px] font-semibold text-[var(--color-accent)]">
                          인기
                        </span>
                      )}
                      <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">
                        {room.joyCurrency > 0 ? '+' : ''}{room.joyCurrency} 조이
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Bottom Ad */}
        <AdBanner slot="timetable-bottom" />
      </div>
    </div>
  );
}

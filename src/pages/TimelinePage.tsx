import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw, Share2, Coffee } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { halls } from '../data/halls';
import { AdBanner } from '../components/AdBanner';

export function TimelinePage() {
  const navigate = useNavigate();
  const { currentCourse, selectedHall } = useAppStore();
  const currentHall = halls.find(h => h.id === selectedHall) ?? halls[0];

  if (!currentCourse) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-[16px] px-[24px]">
        <p className="text-[16px] text-[var(--color-text-secondary)]">생성된 코스가 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate('/course')}
          className="px-[24px] py-[12px] bg-[var(--color-accent)] text-white rounded-[20px] text-[15px] font-semibold"
        >
          코스 생성하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Nav Bar */}
      <div className="flex items-center gap-[12px] px-[16px] py-[12px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기">
          <ChevronLeft size={28} aria-hidden="true" className="text-[var(--color-text-primary)]" />
        </button>
        <h1 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">
          나의 코스
        </h1>
      </div>

      <div className="px-[24px] pb-[24px] flex flex-col gap-[24px]">
        {/* Summary Cards */}
        <div className="flex gap-[12px]">
          <div className="flex-1 bg-[var(--color-accent)] rounded-[20px] p-[16px] flex flex-col gap-[4px]">
            <span className="text-[12px] font-medium text-white/70">총 체험</span>
            <span className="font-display text-[24px] font-extrabold text-white">
              {currentCourse.totalExperiences}개
            </span>
          </div>
          <div className="flex-1 bg-[var(--color-surface)] rounded-[20px] p-[16px] flex flex-col gap-[4px]">
            <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">총 조이</span>
            <span className="font-display text-[24px] font-extrabold text-[var(--color-text-primary)]">
              {currentCourse.totalJoy > 0 ? '+' : ''}{currentCourse.totalJoy}
            </span>
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner slot="timeline-top" />

        {/* Timeline */}
        <div className="flex flex-col gap-[0px]">
          {currentCourse.items.map((item, index) => {
            if (item.type === 'break') {
              return (
                <div key={`break-${index}`} className="flex gap-[16px] items-stretch">
                  {/* Timeline line */}
                  <div className="w-[40px] flex flex-col items-center">
                    <div className="w-[2px] flex-1 bg-[var(--color-elevated)]" />
                    <div className="w-[32px] h-[32px] rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0">
                      <Coffee size={16} className="text-[var(--color-text-secondary)]" />
                    </div>
                    <div className="w-[2px] flex-1 bg-[var(--color-elevated)]" />
                  </div>
                  {/* Break card */}
                  <div className="flex-1 py-[8px]">
                    <div className="bg-[var(--color-surface)] rounded-[16px] px-[16px] py-[12px] flex items-center justify-between">
                      <span className="text-[14px] font-medium text-[var(--color-text-secondary)]">
                        쉬는 시간
                      </span>
                      <span className="text-[13px] text-[var(--color-text-tertiary)]">
                        {item.startTime} - {item.endTime}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            const room = item.room;
            if (!room) return null;

            return (
              <div key={item.roomId} className="flex gap-[16px] items-stretch">
                {/* Timeline line + dot */}
                <div className="w-[40px] flex flex-col items-center">
                  {index > 0 && <div className="w-[2px] flex-1 bg-[var(--color-elevated)]" />}
                  <div
                    className="w-[14px] h-[14px] rounded-full shrink-0 border-[3px]"
                    style={{
                      borderColor: currentHall.color,
                      backgroundColor: index === 0 ? currentHall.color : 'white',
                    }}
                  />
                  {index < currentCourse.items.length - 1 && (
                    <div className="w-[2px] flex-1 bg-[var(--color-elevated)]" />
                  )}
                </div>
                {/* Experience card */}
                <div className="flex-1 py-[6px]">
                  <div
                    className="rounded-[16px] px-[16px] py-[14px] border-[1.5px]"
                    style={{
                      backgroundColor: `${currentHall.color}10`,
                      borderColor: `${currentHall.color}30`,
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-[4px]">
                        <div className="flex items-center gap-[6px]">
                          <span className="text-[18px]">{room.icon}</span>
                          <span className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                            {room.name}
                          </span>
                        </div>
                        <span className="text-[13px] text-[var(--color-text-secondary)]">
                          {room.floor}층 | {room.duration}분 체험
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-[2px]">
                        <span className="text-[13px] font-semibold" style={{ color: currentHall.color }}>
                          {item.startTime}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-tertiary)]">
                          ~{item.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-[8px] flex items-center gap-[8px]">
                      <span
                        className="px-[8px] py-[2px] rounded-[8px] text-[11px] font-medium"
                        style={{
                          backgroundColor: `${currentHall.color}20`,
                          color: currentHall.color,
                        }}
                      >
                        {room.joyCurrency > 0 ? '+' : ''}{room.joyCurrency} 조이
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[12px]">
          <button
            type="button"
            onClick={() => navigate('/course')}
            className="flex-1 h-[52px] bg-[var(--color-surface)] rounded-[24px] flex items-center justify-center gap-[8px]"
          >
            <RotateCcw size={18} aria-hidden="true" className="text-[var(--color-text-secondary)]" />
            <span className="text-[15px] font-semibold text-[var(--color-text-secondary)]">다시 생성</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              const shareText = `[한국잡월드 코스]\n총 ${currentCourse.totalExperiences}개 체험, ${currentCourse.totalJoy > 0 ? '+' : ''}${currentCourse.totalJoy} 조이`;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: '한국잡월드 코스',
                    text: shareText,
                  });
                } catch {
                  // User cancelled or share failed
                }
              } else if (navigator.clipboard) {
                try {
                  await navigator.clipboard.writeText(shareText);
                  alert('코스 정보가 클립보드에 복사되었습니다.');
                } catch {
                  alert('공유 기능을 사용할 수 없습니다.');
                }
              } else {
                alert('공유 기능을 사용할 수 없습니다.');
              }
            }}
            className="flex-1 h-[52px] bg-[var(--color-accent)] rounded-[24px] flex items-center justify-center gap-[8px]"
          >
            <Share2 size={18} aria-hidden="true" className="text-white" />
            <span className="text-[15px] font-semibold text-white">공유하기</span>
          </button>
        </div>

        {/* Bottom Ad */}
        <AdBanner slot="timeline-bottom" />
      </div>
    </div>
  );
}

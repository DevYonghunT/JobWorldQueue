import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Clock, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { halls, hallsWithData } from '../data/halls';
import { rooms } from '../data/rooms';
import type { HallType } from '../data/types';
import { generateCourse } from '../utils/courseGenerator';
import { formatTimeDisplay } from '../utils/time';
import { AdBanner } from '../components/AdBanner';

// Filter halls to only show those with data
const availableHalls = halls.filter(h => hallsWithData.has(h.id));

export function CourseGeneratorPage() {
  const navigate = useNavigate();
  const {
    currentTime, selectedHall, selectedSession, childAge,
    preferredRooms, breakInterval, breakDuration,
    setChildAge, setSelectedHall, setSelectedSession,
    setBreakInterval, setBreakDuration, togglePreferredRoom,
    setCurrentCourse,
  } = useAppStore();

  const currentHall = halls.find(h => h.id === selectedHall) ?? halls[0];
  const hallRooms = rooms.filter(r => r.hall === selectedHall);

  // Filter rooms by age (convert years to months)
  const ageInMonths = childAge * 12;
  const filteredRooms = hallRooms.filter(r => r.minAgeMonths <= ageInMonths);

  const popularRooms = filteredRooms.filter(r => r.isPopular);
  const displayRooms = popularRooms.length > 0 ? popularRooms : filteredRooms.slice(0, 8);

  const handleGenerate = () => {
    const course = generateCourse({
      currentTime,
      session: selectedSession,
      preferredRooms,
      breakInterval,
      breakDuration,
      rooms: filteredRooms,
    });
    setCurrentCourse(course);
    navigate('/timeline');
  };

  return (
    <div className="flex flex-col">
      {/* Nav Bar */}
      <div className="flex items-center gap-[12px] px-[16px] py-[12px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기">
          <ChevronLeft size={28} aria-hidden="true" className="text-[var(--color-text-primary)]" />
        </button>
        <h1 className="font-display text-[20px] font-bold text-[var(--color-text-primary)]">
          스마트 코스 생성
        </h1>
      </div>

      <div className="px-[24px] pb-[24px] flex flex-col gap-[28px]">
        {/* Age */}
        <div className="flex flex-col gap-[12px]">
          <label className="text-[16px] font-semibold text-[var(--color-text-primary)]">아이 나이</label>
          <div className="w-full h-[52px] bg-[var(--color-surface)] rounded-[24px] px-[20px] flex items-center justify-between">
            <select
              value={childAge}
              onChange={(e) => setChildAge(Number(e.target.value))}
              className="bg-transparent text-[16px] font-medium text-[var(--color-text-primary)] outline-none flex-1 appearance-none"
            >
              {Array.from({ length: 15 }, (_, i) => i + 4).map(age => (
                <option key={age} value={age}>{age}세</option>
              ))}
            </select>
            <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />
          </div>
        </div>

        {/* Hall Selection */}
        <div className="flex flex-col gap-[12px]">
          <label className="text-[16px] font-semibold text-[var(--color-text-primary)]">체험관</label>
          <div
            className="w-full h-[52px] rounded-[24px] px-[20px] flex items-center justify-between border-[1.5px]"
            style={{
              backgroundColor: `${currentHall.color}15`,
              borderColor: currentHall.color,
            }}
          >
            <div className="flex items-center gap-[10px]">
              <div
                className="w-[10px] h-[10px] rounded-full"
                style={{ backgroundColor: currentHall.color }}
              />
              <select
                value={`${selectedHall}-${selectedSession}`}
                onChange={(e) => {
                  const [hall, session] = e.target.value.split('-');
                  setSelectedHall(hall as HallType);
                  setSelectedSession(Number(session) as 1 | 2);
                }}
                className="bg-transparent text-[16px] font-medium text-[var(--color-text-primary)] outline-none appearance-none"
              >
                {availableHalls.map(h => (
                  <optgroup key={h.id} label={h.name}>
                    <option value={`${h.id}-1`}>{h.name} (1부)</option>
                    <option value={`${h.id}-2`}>{h.name} (2부)</option>
                  </optgroup>
                ))}
              </select>
            </div>
            <ChevronDown size={20} style={{ color: currentHall.color }} />
          </div>
        </div>

        {/* Start Time */}
        <div className="flex flex-col gap-[12px]">
          <label className="text-[16px] font-semibold text-[var(--color-text-primary)]">시작 시간</label>
          <div className="w-full h-[52px] bg-[var(--color-surface)] rounded-[24px] px-[20px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <Clock size={20} className="text-[var(--color-text-secondary)]" />
              <span className="text-[16px] font-medium text-[var(--color-text-primary)]">
                현재 시간 ({formatTimeDisplay(currentTime)})
              </span>
            </div>
            <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner slot="course-mid" />

        {/* Preferred Rooms */}
        <div className="flex flex-col gap-[12px]">
          <label className="text-[16px] font-semibold text-[var(--color-text-primary)]">
            선호 체험실 (선택)
          </label>
          <div className="flex flex-wrap gap-[8px]">
            {displayRooms.map(room => {
              const isSelected = preferredRooms.includes(room.id);
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => togglePreferredRoom(room.id)}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-[6px] px-[16px] py-[10px] rounded-[20px] text-[14px] font-medium transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {isSelected && <Check size={14} aria-hidden="true" />}
                  {room.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Break Settings */}
        <div className="flex flex-col gap-[12px]">
          <label className="text-[16px] font-semibold text-[var(--color-text-primary)]">
            쉬는 시간 설정
          </label>
          <div className="flex gap-[12px]">
            <div className="flex-1 flex flex-col gap-[6px]">
              <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">간격</span>
              <div className="w-full h-[48px] bg-[var(--color-surface)] rounded-[20px] px-[16px] flex items-center justify-between">
                <select
                  value={breakInterval}
                  onChange={(e) => setBreakInterval(Number(e.target.value))}
                  className="bg-transparent text-[14px] font-medium text-[var(--color-text-primary)] outline-none flex-1 appearance-none"
                >
                  <option value={1}>1개 체험마다</option>
                  <option value={2}>2개 체험마다</option>
                  <option value={3}>3개 체험마다</option>
                  <option value={0}>쉬지 않기</option>
                </select>
                <ChevronDown size={18} className="text-[var(--color-text-secondary)]" />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[6px]">
              <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">휴식 시간</span>
              <div className="w-full h-[48px] bg-[var(--color-surface)] rounded-[20px] px-[16px] flex items-center justify-between">
                <select
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(Number(e.target.value))}
                  className="bg-transparent text-[14px] font-medium text-[var(--color-text-primary)] outline-none flex-1 appearance-none"
                >
                  <option value={5}>5분</option>
                  <option value={10}>10분</option>
                  <option value={15}>15분</option>
                  <option value={20}>20분</option>
                </select>
                <ChevronDown size={18} className="text-[var(--color-text-secondary)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Empty Rooms Warning */}
        {filteredRooms.length === 0 && (
          <div className="flex items-center gap-[10px] px-[16px] py-[12px] bg-[#FEE2E2] rounded-[16px]">
            <AlertCircle size={20} className="text-[#DC2626] shrink-0" />
            <span className="text-[14px] text-[#DC2626]">
              선택한 체험관에 해당 나이의 체험실이 없습니다.
            </span>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={filteredRooms.length === 0}
          className={`w-full h-[56px] rounded-[24px] flex items-center justify-center gap-[10px] ${
            filteredRooms.length === 0
              ? 'bg-[var(--color-surface)] cursor-not-allowed'
              : 'bg-[var(--color-accent)]'
          }`}
        >
          <Sparkles size={22} aria-hidden="true" className={filteredRooms.length === 0 ? 'text-[var(--color-text-tertiary)]' : 'text-white'} />
          <span className={`font-display text-[17px] font-bold ${filteredRooms.length === 0 ? 'text-[var(--color-text-tertiary)]' : 'text-white'}`}>
            코스 생성하기
          </span>
        </button>
      </div>
    </div>
  );
}

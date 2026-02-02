import { User, Settings, Heart, Clock, ChevronRight, Bell, Moon, HelpCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { halls } from '../data/halls';
import { AdBanner } from '../components/AdBanner';

export function ProfilePage() {
  const { childAge, selectedHall } = useAppStore();
  const currentHall = halls.find(h => h.id === selectedHall);

  const menuItems = [
    { icon: Heart, label: '찜한 체험실', badge: '0', color: '#E91E63' },
    { icon: Clock, label: '체험 기록', badge: null, color: '#4A90D9' },
    { icon: Bell, label: '알림 설정', badge: null, color: '#F5A623' },
    { icon: Moon, label: '다크 모드', badge: '곧 출시', color: '#9C27B0' },
    { icon: HelpCircle, label: '도움말 & FAQ', badge: null, color: '#2E7D32' },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-[24px] pt-[14px] pb-[0px]">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-[28px] font-bold text-[var(--color-text-primary)]">
            마이페이지
          </h1>
          <button
            type="button"
            aria-label="설정"
            className="w-[48px] h-[48px] bg-[var(--color-surface)] rounded-[24px] flex items-center justify-center"
          >
            <Settings size={22} aria-hidden="true" className="text-[var(--color-text-primary)]" />
          </button>
        </div>
      </div>

      <div className="px-[24px] pt-[24px] pb-[24px] flex flex-col gap-[24px]">
        {/* Profile Card */}
        <div className="w-full bg-[var(--color-surface)] rounded-[24px] p-[20px] flex items-center gap-[16px]">
          <div className="w-[64px] h-[64px] bg-[var(--color-accent)] rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="font-display text-[18px] font-bold text-[var(--color-text-primary)]">
              게스트
            </span>
            <span className="text-[14px] text-[var(--color-text-secondary)]">
              {childAge}세 아이 · {currentHall?.name ?? '체험관'}
            </span>
          </div>
          <ChevronRight size={20} className="ml-auto text-[var(--color-text-tertiary)]" />
        </div>

        {/* Stats */}
        <div className="flex gap-[12px]">
          <div className="flex-1 bg-[var(--color-surface)] rounded-[20px] p-[16px] flex flex-col items-center gap-[4px]">
            <span className="font-display text-[24px] font-extrabold text-[var(--color-accent)]">0</span>
            <span className="text-[13px] text-[var(--color-text-secondary)]">총 체험</span>
          </div>
          <div className="flex-1 bg-[var(--color-surface)] rounded-[20px] p-[16px] flex flex-col items-center gap-[4px]">
            <span className="font-display text-[24px] font-extrabold text-[var(--color-text-primary)]">0</span>
            <span className="text-[13px] text-[var(--color-text-secondary)]">총 조이</span>
          </div>
          <div className="flex-1 bg-[var(--color-surface)] rounded-[20px] p-[16px] flex flex-col items-center gap-[4px]">
            <span className="font-display text-[24px] font-extrabold text-[var(--color-text-primary)]">0</span>
            <span className="text-[13px] text-[var(--color-text-secondary)]">코스 생성</span>
          </div>
        </div>

        {/* Ad Banner */}
        <AdBanner slot="profile-mid" />

        {/* Menu List */}
        <div className="bg-[var(--color-surface)] rounded-[24px] overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                className={`w-full flex items-center gap-[14px] px-[20px] py-[16px] ${
                  index < menuItems.length - 1 ? 'border-b border-[var(--color-elevated)]' : ''
                }`}
              >
                <div
                  className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Icon size={20} aria-hidden="true" style={{ color: item.color }} />
                </div>
                <span className="text-[15px] font-medium text-[var(--color-text-primary)]">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="ml-auto px-[10px] py-[4px] bg-[var(--color-elevated)] rounded-[10px] text-[12px] font-medium text-[var(--color-text-secondary)]">
                    {item.badge}
                  </span>
                )}
                {!item.badge && (
                  <ChevronRight size={18} className="ml-auto text-[var(--color-text-tertiary)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="flex flex-col items-center gap-[8px] pt-[8px]">
          <span className="text-[13px] text-[var(--color-text-tertiary)]">
            한국잡월드 시간표 & 코스 플래너
          </span>
          <span className="text-[12px] text-[var(--color-text-muted)]">
            버전 1.0.0
          </span>
        </div>
      </div>
    </div>
  );
}

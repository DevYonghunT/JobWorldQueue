import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Sparkles, User } from 'lucide-react';

const tabs = [
  { path: '/', label: '홈', icon: Home },
  { path: '/timetable', label: '시간표', icon: Calendar },
  { path: '/course', label: '코스', icon: Sparkles },
  { path: '/profile', label: '마이', icon: User },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide tab bar on timeline detail page
  const hideTabBar = location.pathname === '/timeline';

  return (
    <div className="font-body h-full w-full max-w-[430px] mx-auto bg-[var(--color-bg)] flex flex-col relative">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {!hideTabBar && (
        <div className="shrink-0 px-[21px] pb-[21px] pt-[12px]">
          <nav aria-label="메인 네비게이션" className="w-full h-[62px] bg-[var(--color-surface)] rounded-[100px] px-[4px] flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.path}
                  type="button"
                  onClick={() => navigate(tab.path)}
                  aria-label={`${tab.label} 탭으로 이동`}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex flex-col items-center gap-[4px] py-[8px] px-[14px] w-full"
                >
                  <Icon
                    size={24}
                    aria-hidden="true"
                    className={isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-tertiary)]'}
                  />
                  <span
                    className={`text-[11px] ${
                      isActive
                        ? 'font-semibold text-[var(--color-accent)]'
                        : 'font-medium text-[var(--color-text-tertiary)]'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}

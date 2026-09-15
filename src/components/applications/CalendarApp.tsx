import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock3,
  MapPin,
  Sparkles,
  Trash2,
  Cake,
  Bell,
  BellRing,
  X,
  Check,
  PartyPopper,
  Flag,
  CalendarDays,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type EventCategory =
  | "Holiday"
  | "Birthday"
  | "Milestone"
  | "Interview"
  | "Sprint"
  | "Personal";

interface CalendarEvent {
  id: string;
  dateStr: string;
  title: string;
  time: string;
  category: EventCategory;
  description?: string;
  location?: string;
  reminder?: boolean;
  recurring?: boolean;
  source?: "custom" | "holiday" | "birthday";
  notified?: boolean;
}

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
}

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY = "ak_calendar_events_v2";
const NOTIFIED_KEY = "ak_calendar_notifications_v2";

const INDIA_COUNTRY_CODE = "IN";

const CATEGORY_STYLES: Record<
  EventCategory,
  {
    icon: React.ReactNode;
    badge: string;
    dot: string;
  }
> = {
  Holiday: {
    icon: <Flag className="h-3.5 w-3.5" />,
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },

  Birthday: {
    icon: <Cake className="h-3.5 w-3.5" />,
    badge: "border-pink-400/20 bg-pink-400/10 text-pink-300",
    dot: "bg-pink-400",
  },

  Milestone: {
    icon: <Sparkles className="h-3.5 w-3.5" />,
    badge: "border-sky-400/20 bg-sky-400/10 text-sky-300",
    dot: "bg-sky-400",
  },

  Interview: {
    icon: <CalendarDays className="h-3.5 w-3.5" />,
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    dot: "bg-violet-400",
  },

  Sprint: {
    icon: <RefreshCw className="h-3.5 w-3.5" />,
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-400",
  },

  Personal: {
    icon: <PartyPopper className="h-3.5 w-3.5" />,
    badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    dot: "bg-cyan-400",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const pad = (value: number) => String(value).padStart(2, "0");

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

const parseDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const formatLongDate = (dateStr: string) => {
  const date = parseDate(dateStr);

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatMonthYear = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const getTodayString = () => formatDate(new Date());

const safeReadEvents = (): CalendarEvent[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveEventsToStorage = (events: CalendarEvent[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

/* =========================================================
   DEFAULT EVENTS
========================================================= */

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: "ak-birthday",
    dateStr: `${new Date().getFullYear()}-10-02`,
    title: "Abhishek's Birthday",
    time: "All Day",
    category: "Birthday",
    description: "A special day 🎂",
    reminder: true,
    recurring: true,
    source: "birthday",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export const CalendarApp: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>(() => {
    const saved = safeReadEvents();

    if (saved.length > 0) {
      return saved;
    }

    return DEFAULT_EVENTS;
  });

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loadingHolidays, setLoadingHolidays] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    getTodayString()
  );

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("10:00");
  const [newEventCategory, setNewEventCategory] =
    useState<EventCategory>("Sprint");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventReminder, setNewEventReminder] = useState(true);

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">(
      typeof window !== "undefined" && "Notification" in window
        ? Notification.permission
        : "unsupported"
    );

  const [notificationMessage, setNotificationMessage] = useState<
    string | null
  >(null);

  const [selectedDay, setSelectedDay] = useState<string | null>(
    null
  );

  const [showEventDetails, setShowEventDetails] = useState(false);

  /* =========================================================
     CURRENT MONTH
  ========================================================= */

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();
  const todayString = getTodayString();

  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(currentDate);

  const isCurrentMonth =
    today.getFullYear() === year &&
    today.getMonth() === month;

  /* =========================================================
     FETCH REAL INDIAN HOLIDAYS
  ========================================================= */

  const fetchHolidays = useCallback(async () => {
    setLoadingHolidays(true);

    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${INDIA_COUNTRY_CODE}`
      );

      if (!response.ok) {
        throw new Error("Holiday API request failed");
      }

      const data: Holiday[] = await response.json();

      setHolidays(data);
    } catch (error) {
      console.error("Unable to load holidays:", error);

      setHolidays([]);
    } finally {
      setLoadingHolidays(false);
    }
  }, [year]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  /* =========================================================
     KEEP BIRTHDAY YEAR CORRECT
  ========================================================= */

  useEffect(() => {
    setCustomEvents((previous) => {
      const birthdayExists = previous.some(
        (event) =>
          event.source === "birthday" ||
          event.id === "ak-birthday"
      );

      if (!birthdayExists) {
        return [
          ...previous,
          {
            ...DEFAULT_EVENTS[0],
            dateStr: `${year}-10-02`,
          },
        ];
      }

      return previous.map((event) => {
        if (
          event.source === "birthday" ||
          event.id === "ak-birthday"
        ) {
          return {
            ...event,
            dateStr: `${year}-10-02`,
          };
        }

        return event;
      });
    });
  }, [year]);

  /* =========================================================
     SAVE CUSTOM EVENTS
  ========================================================= */

  useEffect(() => {
    saveEventsToStorage(customEvents);
  }, [customEvents]);

  /* =========================================================
     REQUEST NOTIFICATION PERMISSION
  ========================================================= */

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      setNotificationPermission(permission);

      if (permission === "granted") {
        new Notification("Abhishek OS Calendar", {
          body: "Calendar notifications are now enabled.",
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  /* =========================================================
     IN-APP NOTIFICATION
  ========================================================= */

  const showNotification = useCallback(
    (title: string, body: string) => {
      setNotificationMessage(`${title} — ${body}`);

      window.setTimeout(() => {
        setNotificationMessage(null);
      }, 7000);

      if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
        });
      }
    },
    []
  );

  /* =========================================================
     NOTIFICATION TRACKING
  ========================================================= */

  const getNotifiedIds = () => {
    try {
      const value = localStorage.getItem(NOTIFIED_KEY);

      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  };

  const markAsNotified = (key: string) => {
    const current = getNotifiedIds();

    current[key] = true;

    localStorage.setItem(
      NOTIFIED_KEY,
      JSON.stringify(current)
    );
  };

  /* =========================================================
     CHECK EVENTS FOR TODAY
  ========================================================= */

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const currentDateString = formatDate(now);

      const notified = getNotifiedIds();

      const todaysEvents = customEvents.filter(
        (event) =>
          event.dateStr === currentDateString &&
          event.reminder !== false
      );

      todaysEvents.forEach((event) => {
        const notificationKey = `${event.id}-${currentDateString}`;

        if (notified[notificationKey]) {
          return;
        }

        showNotification(
          `📅 ${event.title}`,
          event.time === "All Day"
            ? "This event is scheduled for today."
            : `Scheduled for ${event.time}.`
        );

        markAsNotified(notificationKey);
      });

      const todaysHolidays = holidays.filter(
        (holiday) => holiday.date === currentDateString
      );

      todaysHolidays.forEach((holiday) => {
        const notificationKey = `holiday-${holiday.date}-${holiday.name}`;

        if (notified[notificationKey]) {
          return;
        }

        showNotification(
          `🇮🇳 ${holiday.localName}`,
          "Today is a public holiday."
        );

        markAsNotified(notificationKey);
      });
    };

    checkNotifications();

    const interval = window.setInterval(
      checkNotifications,
      60 * 1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    customEvents,
    holidays,
    showNotification,
  ]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const prevMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  /* =========================================================
     HOLIDAY MAP
  ========================================================= */

  const holidayMap = useMemo(() => {
    const map = new Map<string, Holiday[]>();

    holidays.forEach((holiday) => {
      const current = map.get(holiday.date) ?? [];

      current.push(holiday);

      map.set(holiday.date, current);
    });

    return map;
  }, [holidays]);

  /* =========================================================
     EVENTS FOR DATE
  ========================================================= */

  const getEventsForDate = (dateStr: string) => {
    const events = customEvents.filter(
      (event) => event.dateStr === dateStr
    );

    const holidayEvents: CalendarEvent[] =
      (holidayMap.get(dateStr) ?? []).map(
        (holiday) => ({
          id: `holiday-${holiday.date}-${holiday.name}`,
          dateStr: holiday.date,
          title: holiday.localName || holiday.name,
          time: "All Day",
          category: "Holiday",
          description: holiday.name,
          reminder: true,
          source: "holiday",
        })
      );

    return [...holidayEvents, ...events];
  };

  /* =========================================================
     UPCOMING EVENTS
  ========================================================= */

  const upcomingEvents = useMemo(() => {
    const allEvents: CalendarEvent[] = [
      ...customEvents,
      ...holidays.map((holiday) => ({
        id: `holiday-${holiday.date}-${holiday.name}`,
        dateStr: holiday.date,
        title: holiday.localName || holiday.name,
        time: "All Day",
        category: "Holiday" as EventCategory,
        description: holiday.name,
        reminder: true,
        source: "holiday" as const,
      })),
    ];

    return allEvents
      .filter(
        (event) =>
          event.dateStr >= todayString
      )
      .sort(
        (a, b) =>
          a.dateStr.localeCompare(b.dateStr)
      )
      .slice(0, 8);
  }, [
    customEvents,
    holidays,
    todayString,
  ]);

  /* =========================================================
     ADD EVENT
  ========================================================= */

  const openAddModal = (dateStr?: string) => {
    setSelectedDate(
      dateStr ?? todayString
    );

    setNewEventTitle("");
    setNewEventTime("10:00");
    setNewEventCategory("Sprint");
    setNewEventDescription("");
    setNewEventLocation("");
    setNewEventReminder(true);

    setShowAddModal(true);
  };

  const addEvent = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!newEventTitle.trim()) {
      return;
    }

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      dateStr: selectedDate,
      title: newEventTitle.trim(),
      time: newEventTime || "All Day",
      category: newEventCategory,
      description:
        newEventDescription.trim() || undefined,
      location:
        newEventLocation.trim() || undefined,
      reminder: newEventReminder,
      recurring: false,
      source: "custom",
    };

    setCustomEvents((previous) => [
      ...previous,
      newEvent,
    ]);

    setShowAddModal(false);

    showNotification(
      "Event Added",
      `${newEvent.title} — ${formatLongDate(
        selectedDate
      )}`
    );
  };

  /* =========================================================
     DELETE EVENT
  ========================================================= */

  const deleteEvent = (id: string) => {
    setCustomEvents((previous) =>
      previous.filter(
        (event) => event.id !== id
      )
    );

    setShowEventDetails(false);
  };

  /* =========================================================
     CALENDAR DAYS
  ========================================================= */

  const calendarDays = useMemo(() => {
    const cells: Array<{
      type: "empty" | "day";
      day?: number;
      dateStr?: string;
    }> = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({
        type: "empty",
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const dateStr = `${year}-${pad(
        month + 1
      )}-${pad(day)}`;

      cells.push({
        type: "day",
        day,
        dateStr,
      });
    }

    return cells;
  }, [
    firstDayOfWeek,
    daysInMonth,
    year,
    month,
  ]);

  /* =========================================================
     SELECT DATE
  ========================================================= */

  const handleDayClick = (dateStr: string) => {
    setSelectedDay(dateStr);
    setShowEventDetails(true);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="relative flex h-full w-full select-none flex-col overflow-hidden bg-[#070a0f] font-sans text-slate-100">
      {/* =====================================================
          TOP GLOW
      ===================================================== */}

      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[320px] w-[620px] -translate-x-1/2 rounded-full bg-sky-500/[0.07] blur-[100px]" />

      {/* =====================================================
          NOTIFICATION TOAST
      ===================================================== */}

      <AnimatePresence>
        {notificationMessage && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.96,
            }}
            className="absolute right-5 top-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl border border-sky-400/20 bg-[#0c1119]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
              <BellRing className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-white">
                Calendar Reminder
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                {notificationMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotificationMessage(null)
              }
              className="rounded-lg p-1 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative z-10 shrink-0 border-b border-white/[0.06] px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: -3,
              }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-400 shadow-lg shadow-sky-500/5"
            >
              <CalendarIcon className="h-5 w-5" />
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                  {monthName} {year}
                </h1>

                {loadingHolidays && (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-500" />
                )}
              </div>

              <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                Your schedule, Indian holidays, milestones & reminders
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Notification */}
            <button
              type="button"
              onClick={
                notificationPermission ===
                "granted"
                  ? undefined
                  : requestNotificationPermission
              }
              title={
                notificationPermission ===
                "granted"
                  ? "Notifications enabled"
                  : "Enable calendar notifications"
              }
              className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition ${
                notificationPermission ===
                "granted"
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              {notificationPermission ===
              "granted" ? (
                <BellRing className="h-3.5 w-3.5" />
              ) : (
                <Bell className="h-3.5 w-3.5" />
              )}

              <span className="hidden sm:inline">
                {notificationPermission ===
                "granted"
                  ? "Alerts On"
                  : "Enable Alerts"}
              </span>
            </button>

            {/* Today */}
            <button
              type="button"
              onClick={goToToday}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.07]"
            >
              Today
            </button>

            {/* Navigation */}
            <div className="flex items-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.03] p-0.5">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={nextMonth}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Add */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                openAddModal(todayString)
              }
              className="flex items-center gap-1.5 rounded-xl bg-sky-400 px-3 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-sky-500/10 transition hover:bg-sky-300"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                Add Event
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-5 lg:flex-row">
        {/* ===================================================
            CALENDAR
        =================================================== */}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b1017]/90 shadow-2xl shadow-black/20">
          {/* Week header */}
          <div className="grid shrink-0 grid-cols-7 border-b border-white/[0.06] bg-white/[0.015]">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 sm:text-[11px]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid min-h-0 flex-1 grid-cols-7 auto-rows-fr overflow-auto">
            {calendarDays.map(
              (cell, index) => {
                if (cell.type === "empty") {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="border-b border-r border-white/[0.035] bg-black/[0.04]"
                    />
                  );
                }

                const dateStr =
                  cell.dateStr!;

                const day =
                  cell.day!;

                const dayEvents =
                  getEventsForDate(
                    dateStr
                  );

                const isToday =
                  dateStr === todayString;

                const isSelected =
                  selectedDay ===
                  dateStr;

                const holiday =
                  holidayMap.get(
                    dateStr
                  )?.[0];

                const hasBirthday =
                  customEvents.some(
                    (event) =>
                      event.dateStr ===
                        dateStr &&
                      event.category ===
                        "Birthday"
                  );

                return (
                  <motion.button
                    key={dateStr}
                    type="button"
                    onClick={() =>
                      handleDayClick(
                        dateStr
                      )
                    }
                    whileHover={{
                      backgroundColor:
                        "rgba(255,255,255,0.035)",
                    }}
                    className={`group relative min-h-[78px] border-b border-r border-white/[0.035] p-2 text-left transition sm:min-h-[92px] ${
                      isSelected
                        ? "bg-sky-400/[0.07]"
                        : ""
                    }`}
                  >
                    {/* Today indicator */}
                    {isToday && (
                      <motion.div
                        layoutId="today-indicator"
                        className="absolute inset-x-1 top-1 h-0.5 rounded-full bg-sky-400"
                      />
                    )}

                    {/* Date */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition ${
                          isToday
                            ? "bg-sky-400 font-extrabold text-slate-950 shadow-lg shadow-sky-500/20"
                            : "text-slate-400 group-hover:text-white"
                        }`}
                      >
                        {day}
                      </span>

                      {hasBirthday && (
                        <Cake className="h-3.5 w-3.5 text-pink-400" />
                      )}
                    </div>

                    {/* Holiday name */}
                    {holiday && (
                      <div className="mt-2 hidden truncate text-[9px] font-semibold text-emerald-400/80 sm:block">
                        {holiday.localName}
                      </div>
                    )}

                    {/* Event pills */}
                    <div className="mt-1.5 space-y-1">
                      {dayEvents
                        .slice(0, 2)
                        .map((event) => {
                          const style =
                            CATEGORY_STYLES[
                              event.category
                            ];

                          return (
                            <div
                              key={event.id}
                              className={`flex items-center gap-1 truncate rounded-md border px-1.5 py-1 text-[9px] font-semibold ${style.badge}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
                              />

                              <span className="truncate">
                                {
                                  event.title
                                }
                              </span>
                            </div>
                          );
                        })}

                      {dayEvents.length >
                        2 && (
                        <span className="block px-1 text-[8px] font-medium text-slate-600">
                          +
                          {dayEvents.length -
                            2}{" "}
                          more
                        </span>
                      )}
                    </div>

                    {/* Add on hover */}
                    <span className="pointer-events-none absolute bottom-2 right-2 opacity-0 transition group-hover:opacity-100">
                      <Plus className="h-3.5 w-3.5 text-sky-400" />
                    </span>
                  </motion.button>
                );
              }
            )}
          </div>
        </div>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <div className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b1017]/90 lg:w-[310px]">
          {/* Sidebar header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
                Upcoming
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Events & holidays
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>

          {/* Event list */}
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {upcomingEvents.length ===
            0 ? (
              <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                <CalendarDays className="mb-3 h-8 w-8 text-slate-700" />

                <p className="text-xs font-semibold text-slate-500">
                  Nothing scheduled
                </p>

                <p className="mt-1 text-[10px] leading-5 text-slate-700">
                  Add an event to your calendar.
                </p>
              </div>
            ) : (
              upcomingEvents.map(
                (event, index) => {
                  const style =
                    CATEGORY_STYLES[
                      event.category
                    ];

                  return (
                    <motion.div
                      key={`${event.id}-${index}`}
                      initial={{
                        opacity: 0,
                        x: 8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.035,
                      }}
                      className="group rounded-xl border border-white/[0.055] bg-black/20 p-3 transition hover:border-white/[0.1] hover:bg-white/[0.025]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${style.badge}`}
                        >
                          {style.icon}
                          {event.category}
                        </div>

                        {event.source ===
                          "custom" && (
                          <button
                            type="button"
                            onClick={() =>
                              deleteEvent(
                                event.id
                              )
                            }
                            className="rounded-lg p-1 text-slate-700 opacity-0 transition hover:bg-red-400/10 hover:text-red-400 group-hover:opacity-100"
                            title="Delete event"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <h3 className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-200">
                        {event.title}
                      </h3>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <CalendarIcon className="h-3 w-3" />
                          {formatLongDate(
                            event.dateStr
                          )}
                        </div>

                        {event.time !==
                          "All Day" && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <Clock3 className="h-3 w-3" />
                            {event.time}
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">
                              {
                                event.location
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                }
              )
            )}
          </div>

          {/* Birthday highlight */}
          <div className="shrink-0 border-t border-white/[0.06] p-3">
            <div className="relative overflow-hidden rounded-xl border border-pink-400/15 bg-gradient-to-br from-pink-400/[0.09] to-purple-400/[0.04] p-3">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-pink-400/10 blur-2xl" />

              <div className="relative flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-400/10 text-pink-400">
                  <Cake className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
                    Annual Reminder
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-white">
                    October 2 • Abhishek's Birthday
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ADD EVENT MODAL
      ===================================================== */}

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowAddModal(false);
              }
            }}
          >
            <motion.form
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 28,
              }}
              onSubmit={addEvent}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c1119] shadow-2xl shadow-black/60"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
                    <Plus className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Add Event
                    </h2>

                    <p className="text-[10px] text-slate-500">
                      Create a new calendar reminder
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="space-y-4 p-5">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Event title
                  </label>

                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(event) =>
                      setNewEventTitle(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Interview with recruiter"
                    autoFocus
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-sky-400/40 focus:bg-white/[0.025]"
                  />
                </div>

                {/* Date / Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </label>

                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(event) =>
                        setSelectedDate(
                          event.target.value
                        )
                      }
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs text-white outline-none focus:border-sky-400/40"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Time
                    </label>

                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(event) =>
                        setNewEventTime(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs text-white outline-none focus:border-sky-400/40"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </label>

                  <div className="relative">
                    <select
                      value={
                        newEventCategory
                      }
                      onChange={(event) =>
                        setNewEventCategory(
                          event.target
                            .value as EventCategory
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 pr-9 text-xs text-white outline-none focus:border-sky-400/40"
                    >
                      <option value="Milestone">
                        Milestone
                      </option>
                      <option value="Interview">
                        Interview
                      </option>
                      <option value="Sprint">
                        Sprint
                      </option>
                      <option value="Personal">
                        Personal
                      </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Description
                  </label>

                  <textarea
                    value={
                      newEventDescription
                    }
                    onChange={(event) =>
                      setNewEventDescription(
                        event.target.value
                      )
                    }
                    placeholder="Optional details..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-slate-700 focus:border-sky-400/40"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Location
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />

                    <input
                      type="text"
                      value={
                        newEventLocation
                      }
                      onChange={(event) =>
                        setNewEventLocation(
                          event.target.value
                        )
                      }
                      placeholder="Optional location"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/20 py-2.5 pl-9 pr-3 text-xs text-white outline-none focus:border-sky-400/40"
                    />
                  </div>
                </div>

                {/* Reminder */}
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/10 text-sky-400">
                      <Bell className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Remind me
                      </p>

                      <p className="text-[10px] text-slate-600">
                        Notify me when this event is due
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={
                      newEventReminder
                    }
                    onChange={(event) =>
                      setNewEventReminder(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-sky-400"
                  />
                </label>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] bg-black/10 px-5 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Cancel
                </button>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-sky-300"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Event
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
          DAY DETAILS MODAL
      ===================================================== */}

      <AnimatePresence>
        {showEventDetails &&
          selectedDay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              onMouseDown={(event) => {
                if (
                  event.target ===
                  event.currentTarget
                ) {
                  setShowEventDetails(false);
                }
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.97,
                }}
                className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c1119] shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                      Calendar Day
                    </p>

                    <h2 className="mt-1 text-base font-bold text-white">
                      {formatLongDate(
                        selectedDay
                      )}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowEventDetails(
                        false
                      )
                    }
                    className="rounded-xl p-2 text-slate-500 hover:bg-white/[0.05] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Events */}
                <div className="max-h-[55vh] space-y-2 overflow-y-auto p-4">
                  {getEventsForDate(
                    selectedDay
                  ).length === 0 ? (
                    <div className="py-8 text-center">
                      <CalendarDays className="mx-auto mb-3 h-8 w-8 text-slate-700" />

                      <p className="text-xs font-semibold text-slate-500">
                        No events
                      </p>

                      <p className="mt-1 text-[10px] text-slate-700">
                        This day is completely free.
                      </p>
                    </div>
                  ) : (
                    getEventsForDate(
                      selectedDay
                    ).map((event) => {
                      const style =
                        CATEGORY_STYLES[
                          event.category
                        ];

                      return (
                        <div
                          key={event.id}
                          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-bold uppercase ${style.badge}`}
                            >
                              {style.icon}
                              {
                                event.category
                              }
                            </div>

                            {event.source ===
                              "custom" && (
                              <button
                                type="button"
                                onClick={() =>
                                  deleteEvent(
                                    event.id
                                  )
                                }
                                className="rounded-lg p-1.5 text-slate-600 transition hover:bg-red-400/10 hover:text-red-400"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <h3 className="mt-3 text-sm font-bold text-white">
                            {event.title}
                          </h3>

                          {event.description && (
                            <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                              {
                                event.description
                              }
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock3 className="h-3 w-3" />
                              {event.time}
                            </span>

                            {event.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3" />
                                {
                                  event.location
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.06] p-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventDetails(
                        false
                      );

                      openAddModal(
                        selectedDay
                      );
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-sky-300"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Event for This Day
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarApp;
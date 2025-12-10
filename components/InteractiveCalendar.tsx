import { useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface EventCategory {
  id: string;
  name: string;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  categoryId?: string;
}

export interface DayData {
  date: string; // Format: YYYY-MM-DD
  categoryId?: string;
  events: Event[];
}

export interface InteractiveCalendarProps {
  month: number; // 1-12 (Januar = 1)
  year: number;
  categories: Category[];
  eventCategories?: EventCategory[]; // Kategorien für Termine (z.B. Wunsch-Schicht)
  initialDayData?: DayData[];
  onDayDataChange?: (dayData: DayData[]) => void;
  maxVisibleEvents?: number; // Maximale Anzahl sichtbarer Termine pro Tag (Standard: alle anzeigen)
  showLegend?: boolean; // Zeigt die Kategorien-Legende an (Standard: true)
  showCategoryTitle?: boolean; // Zeigt den Kategorienamen im Tag an (Standard: true)
  className?: string; // Zusätzliche CSS-Klassen für das Container-Element
  readOnly?: boolean; // Aktiviert den Read-Only-Modus (Standard: false)
  container?: HTMLElement | null; // Portal container for fullscreen mode
}

export function InteractiveCalendar({
  month,
  year,
  categories,
  eventCategories = [],
  initialDayData = [],
  onDayDataChange,
  maxVisibleEvents,
  showLegend = true,
  showCategoryTitle = false,
  className = "",
  readOnly = false,
  container,
}: InteractiveCalendarProps) {
  const [dayData, setDayData] = useState<DayData[]>(initialDayData);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState<{ [key: string]: string }>({});
  const [selectedEventCategory, setSelectedEventCategory] = useState<{ [key: string]: string | null }>({});
  const [popoverMode, setPopoverMode] = useState<{ [key: string]: "overview" | "add-event" }>({});
  const eventIdCounter = useRef(0);

  // Hilfsfunktionen für Datum
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1; // Montag = 0, Sonntag = 6
  };

  const formatDate = (day: number) => {
    const monthStr = String(month).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${monthStr}-${dayStr}`;
  };

  const getDayData = (date: string): DayData => {
    return dayData.find((d) => d.date === date) || { date, events: [] };
  };

  const updateDayData = (date: string, updates: Partial<DayData>) => {
    const newDayData = [...dayData];
    const existingIndex = newDayData.findIndex((d) => d.date === date);

    if (existingIndex >= 0) {
      newDayData[existingIndex] = { ...newDayData[existingIndex], ...updates };
    } else {
      newDayData.push({ date, events: [], ...updates });
    }

    setDayData(newDayData);
    onDayDataChange?.(newDayData);
  };

  const setCategory = (date: string, categoryId: string | undefined) => {
    updateDayData(date, { categoryId });
  };

  const addEvent = (date: string, title: string, categoryId?: string) => {
    const current = getDayData(date);
    const newEvent: Event = {
      id: `${date}-${++eventIdCounter.current}`,
      title,
      categoryId,
    };
    updateDayData(date, { events: [...current.events, newEvent] });
    setNewEventTitle({ ...newEventTitle, [date]: "" });
    setSelectedEventCategory({ ...selectedEventCategory, [date]: null });
    setPopoverMode({ ...popoverMode, [date]: "overview" });
  };

  const removeEvent = (date: string, eventId: string) => {
    const current = getDayData(date);
    updateDayData(date, {
      events: current.events.filter((e) => e.id !== eventId),
    });
  };

  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return "transparent";
    return categories.find((c) => c.id === categoryId)?.color || "transparent";
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return null;
    return categories.find((c) => c.id === categoryId)?.name;
  };

  const getEventCategoryName = (categoryId?: string) => {
    if (!categoryId) return null;
    return eventCategories.find((c) => c.id === categoryId)?.name;
  };

  // Kalender rendern
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  // Tage vom vorherigen Monat berechnen
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

  const calendarDays: Array<{ day: number; isCurrentMonth: boolean }> = [];
  
  // Tage vom vorherigen Monat
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  
  // Tage vom aktuellen Monat
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, isCurrentMonth: true });
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center">
          {monthNames[month - 1]} {year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Wochentage Header */}
          {weekDays.map((day) => (
            <div key={day} className="text-center p-2 font-medium">
              {day}
            </div>
          ))}

          {/* Kalendertage */}
          {calendarDays.map((dayObj, index) => {
            const { day, isCurrentMonth } = dayObj;

            // Vorheriger Monat - ausgegraut und nicht interaktiv
            if (!isCurrentMonth) {
              return (
                <div
                  key={`prev-${index}`}
                  className="border rounded-lg p-2 text-left relative min-h-24 flex flex-col opacity-30 bg-gray-50"
                >
                  <div className="mb-1 text-gray-400">{day}</div>
                </div>
              );
            }

            const date = formatDate(day);
            const data = getDayData(date);
            const bgColor = getCategoryColor(data.categoryId);
            const categoryName = getCategoryName(data.categoryId);

            return (
              <Popover
                key={date}
                open={openPopover === date}
                onOpenChange={(open) => setOpenPopover(open ? date : null)}
              >
                <PopoverTrigger asChild>
                  <button
                    className="border rounded-lg p-2 hover:border-gray-400 transition-colors text-left relative min-h-24 flex flex-col"
                    style={{ backgroundColor: bgColor }}
                  >
                    <div className="mb-1">{day}</div>
                  
                  {/* Termine anzeigen */}
                  <div className="flex-1 flex flex-wrap gap-1 content-start overflow-hidden">
                    {(maxVisibleEvents !== undefined
                      ? data.events.slice(0, maxVisibleEvents)
                      : data.events
                    ).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs px-1.5 py-0.5 rounded truncate border max-w-full"
                        style={{ 
                          backgroundColor: event.categoryId 
                            ? eventCategories.find((c) => c.id === event.categoryId)?.color 
                            : "rgba(255, 255, 255, 0.6)",
                          borderColor: event.categoryId 
                            ? eventCategories.find((c) => c.id === event.categoryId)?.color 
                            : "rgb(209, 213, 219)"
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {maxVisibleEvents !== undefined &&
                      data.events.length > maxVisibleEvents && (
                        <div className="text-xs text-gray-600 px-1.5">
                          +{data.events.length - maxVisibleEvents} mehr
                        </div>
                      )}
                  </div>
                  
                  { showCategoryTitle && categoryName && (
                    <div className="text-xs mt-auto pt-1 truncate opacity-80">
                      {categoryName}
                    </div>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start" container={container}>
                {/* Übersicht Modus */}
                {(!popoverMode[date] || popoverMode[date] === "overview") && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2">
                        {day}. {monthNames[month - 1]} {year}
                      </h3>
                    </div>

                    {/* Kategorie auswählen */}
                    <div>
                      <Label>Kategorie</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                          variant={data.categoryId === undefined ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCategory(date, undefined)}
                          disabled={readOnly}
                        >
                          Keine
                        </Button>
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={data.categoryId === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategory(date, category.id)}
                            disabled={readOnly}
                            style={{
                              backgroundColor:
                                data.categoryId === category.id
                                  ? category.color
                                  : "transparent",
                              borderColor: category.color,
                            }}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Termine */}
                    <div>
                      <Label>Termine</Label>
                      
                      {/* Termin-Kategorie Buttons - nur anzeigen wenn nicht readOnly */}
                      {!readOnly && eventCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {eventCategories.map((eventCat) => (
                            <Button
                              key={eventCat.id}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedEventCategory({ 
                                  ...selectedEventCategory, 
                                  [date]: eventCat.id 
                                });
                                setPopoverMode({ ...popoverMode, [date]: "add-event" });
                              }}
                              style={{
                                borderColor: eventCat.color,
                                backgroundColor: "transparent",
                              }}
                            >
                              {eventCat.name} hinzufügen
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Termine Liste mit ScrollArea */}
                      {data.events.length > 0 && (
                        <ScrollArea 
                          className="h-[200px] mt-2"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-2 pr-4">
                            {data.events.map((event) => (
                              <div
                                key={event.id}
                                className="flex items-center justify-between p-2 rounded"
                                style={{ 
                                  backgroundColor: event.categoryId 
                                    ? eventCategories.find((c) => c.id === event.categoryId)?.color 
                                    : "rgb(243, 244, 246)"
                                }}
                              >
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm">{event.title}</span>
                                  {event.categoryId && (
                                    <span className="text-xs opacity-70">
                                      {getEventCategoryName(event.categoryId)}
                                    </span>
                                  )}
                                </div>
                                {!readOnly && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEvent(date, event.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                )}

                {/* Termin hinzufügen Modus */}
                {popoverMode[date] === "add-event" && selectedEventCategory[date] && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      {day}. {monthNames[month - 1]} {year}
                    </div>
                    <div>
                      <h3 className="mb-3">
                        {eventCategories.find((c) => c.id === selectedEventCategory[date])?.name} hinzufügen
                      </h3>
                      <Input
                        placeholder="Name eingeben"
                        value={newEventTitle[date] || ""}
                        onChange={(e) =>
                          setNewEventTitle({ ...newEventTitle, [date]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newEventTitle[date]?.trim()) {
                            addEvent(date, newEventTitle[date].trim(), selectedEventCategory[date] || undefined);
                          }
                        }}
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          if (newEventTitle[date]?.trim()) {
                            addEvent(date, newEventTitle[date].trim(), selectedEventCategory[date] || undefined);
                          }
                        }}
                        disabled={!newEventTitle[date]?.trim()}
                      >
                        Speichern
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setPopoverMode({ ...popoverMode, [date]: "overview" });
                          setSelectedEventCategory({ ...selectedEventCategory, [date]: null });
                          setNewEventTitle({ ...newEventTitle, [date]: "" });
                        }}
                      >
                        Zurück
                      </Button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          );
          })}
        </div>

        {/* Legende */}
        {showLegend && (categories.length > 0 || eventCategories.length > 0) && (
          <div className="mt-6 space-y-3">
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm font-medium">Tag-Kategorien:</span>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            )}
            {eventCategories.length > 0 && (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm font-medium">Termin-Kategorien:</span>
                {eventCategories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

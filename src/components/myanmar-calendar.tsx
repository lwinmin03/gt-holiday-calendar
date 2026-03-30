import React, { useState, useEffect } from 'react';
import { fetchHolidaysFromConstant, type HolidayData } from '../services/api';

const MONTHS: string[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const WEEKDAYS: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MyanmarCalendar(): React.ReactElement {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [pageIndex, setPageIndex] = useState<number>(Math.floor(new Date().getMonth() / 4)); 
  const [holidays, setHolidays] = useState<HolidayData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const today = new Date();
  const currentRealYear = today.getFullYear();
  const currentRealMonth = today.getMonth();
  const currentRealDay = today.getDate();

  useEffect(() => {
    setIsLoading(true);
    fetchHolidaysFromConstant(currentYear).then((data) => {
      setHolidays(data);
      setIsLoading(false);
    });
  }, [currentYear]);

  const getMonthData = (monthIndex: number): { blanks: number[], days: number[] } => {
    const firstDay = new Date(currentYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { blanks, days };
  };

  const handlePrev = (): void => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
    else if (currentYear > 2021) {
      setCurrentYear(prev => prev - 1);
      setPageIndex(2); 
    }
  };

  const handleNext = (): void => {
    if (pageIndex < 2) setPageIndex(pageIndex + 1);
    else if (currentYear < 2026) {
      setCurrentYear(prev => prev + 1);
      setPageIndex(0); 
    }
  };

  const displayedMonths: number[] = Array.from({ length: 4 }, (_, i) => (pageIndex * 4) + i);

  const SkeletonCalendar = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-sm border border-white/50 animate-pulse">
          <div className="h-6 bg-slate-200 rounded-full w-1/2 mx-auto mb-6"></div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={`head-${j}`} className="h-4 bg-slate-200 rounded-md mx-1"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, k) => (
              <div key={`cell-${k}`} className="h-10 w-10 bg-slate-100 rounded-full mx-auto"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-800 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100"
      style={{ fontFamily: "'Inter', sans-serif" }} 
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white/80 backdrop-blur-md p-6 sm:px-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <h1 
            className="text-2xl sm:text-3xl font-bold text-indigo-950 mb-6 sm:mb-0 tracking-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Myanmar Public Holiday Calendar 🇲🇲
          </h1>
          
          <div className="flex items-center space-x-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button 
              onClick={handlePrev}
              disabled={currentYear === 2021 && pageIndex === 0}
              className="px-5 py-2.5 bg-white hover:bg-indigo-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-sm text-sm font-medium"
            >
              &larr; Prev
            </button>
            <div 
              className="text-lg font-bold w-24 text-center text-indigo-900"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {currentYear}
            </div>
            <button 
              onClick={handleNext}
              disabled={currentYear === 2026 && pageIndex === 2}
              className="px-5 py-2.5 bg-white hover:bg-indigo-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-sm text-sm font-medium"
            >
              Next &rarr;
            </button>
          </div>
        </div>

        {isLoading ? (
          <SkeletonCalendar />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedMonths.map((monthIndex) => {
              const { blanks, days } = getMonthData(monthIndex);
              
              return (
                <div 
                  key={monthIndex} 
                  className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300"
                >
                  <h2 
                    className="text-xl font-bold text-indigo-950 text-center mb-6"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {MONTHS[monthIndex]}
                  </h2>
                  
                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {WEEKDAYS.map(day => (
                      <div key={day} className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
                    {blanks.map(blank => (
                      <div key={`blank-${blank}`} className="h-10 w-10 mx-auto"></div>
                    ))}
                    
                    {days.map(day => {
                      const dateString = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const holidayName = holidays[dateString];
                      const isHoliday = !!holidayName;
                      
                      const isToday = currentYear === currentRealYear && monthIndex === currentRealMonth && day === currentRealDay;
                      
                      return (
                        <div key={day} className="relative flex justify-center items-center group mx-auto hover:z-50">
                          <div 
                            className={`flex justify-center items-center h-9 w-9 sm:h-10 sm:w-10 rounded-2xl text-sm font-medium transition-all duration-300 cursor-default
                              ${isHoliday 
                                ? 'bg-rose-100 text-rose-700 font-bold hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 ring-1 ring-rose-200' 
                                : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                              }
                              ${isToday && !isHoliday ? 'ring-2 ring-indigo-500 bg-indigo-50 text-indigo-700 font-bold shadow-md' : ''}
                              ${isToday && isHoliday ? 'ring-4 ring-indigo-400 shadow-md' : ''}
                            `}
                          >
                            {day}
                          </div>
                          
                          {/* Tooltip */}
                          {isHoliday && (
                            <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none w-max max-w-[250px] animate-in fade-in slide-in-from-bottom-1 duration-200 z-50">
                              <span className="bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-xl text-center whitespace-normal break-words leading-relaxed w-full">
                                {holidayName.split(/[/,]/).map((name, i, arr) => (
                                  <React.Fragment key={i}>
                                    <span className="block py-0.5">{name.trim()}</span>
                                    {i < arr.length - 1 && <hr className="border-slate-600 my-1 w-3/4 mx-auto" />}
                                  </React.Fragment>
                                ))}
                              </span>
                              <div className="w-2.5 h-2.5 -mt-1 bg-slate-800 rotate-45 rounded-sm"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ArrowUp, 
  ArrowDown,
  SortAsc,
  SortDesc,
  Check
} from 'lucide-react';
import type { SortField, SortDirection } from '../../lib/types';
import { SORT_OPTIONS } from '../../lib/constants';

interface SortDropdownProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortFieldChange: (field: SortField) => void;
  onToggleSortDirection: () => void;
  className?: string;
}

export function SortDropdown({
  sortField,
  sortDirection,
  onSortFieldChange,
  onToggleSortDirection,
  className = ""
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentFieldLabel = SORT_OPTIONS[sortField];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSortFieldChange = (field: SortField) => {
    onSortFieldChange(field);
    setIsOpen(false);
  };

  const handleToggleDirection = () => {
    onToggleSortDirection();
    setIsOpen(false);
  };

  // Calculate if dropdown should open upward on mobile to prevent cutoff
  const shouldOpenUpward = useCallback(() => {
    if (typeof window === 'undefined' || !dropdownRef.current) return false;
    
    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Open upward if there's more space above and less than 300px below
    return spaceBelow < 300 && spaceAbove > spaceBelow;
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 min-w-0 max-w-[160px] sm:max-w-[200px]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {sortDirection === 'asc' ? (
          <SortAsc className="h-4 w-4 shrink-0" />
        ) : (
          <SortDesc className="h-4 w-4 shrink-0" />
        )}
        <span className="hidden sm:inline truncate text-xs sm:text-sm">Sort by {currentFieldLabel}</span>
        <span className="sm:hidden text-xs">Sort</span>
        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 z-40 sm:hidden" 
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-w-[calc(100vw-2rem)] ${
              shouldOpenUpward() ? 'bottom-full mb-2' : 'top-full'
            }`}
            role="listbox"
          >
            {/* Direction Toggle */}
            <button
              onClick={handleToggleDirection}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 first:rounded-t-md border-b border-gray-100 dark:border-gray-700"
              role="option"
              aria-selected="false"
            >
              {sortDirection === 'asc' ? (
                <ArrowUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <ArrowDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
              <span className="text-sm font-medium">
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </span>
            </button>
            
            {/* Sort Field Options */}
            {(Object.entries(SORT_OPTIONS) as [SortField, string][]).map(([field, label]) => (
              <button
                key={field}
                onClick={() => handleSortFieldChange(field)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 last:rounded-b-md transition-colors ${
                  field === sortField ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                }`}
                role="option"
                aria-selected={field === sortField}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {field === sortField && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
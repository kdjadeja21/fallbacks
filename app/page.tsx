"use client";

import { Suspense, useState } from "react";
import { snippets } from "./data/snippets";
import { LazyErrorBoundaryCard } from "./components/gallery/LazyErrorBoundaryCard";
import { HeaderBanner } from "./components/layout/HeaderBanner";
import { StickyHeader } from "./components/layout/StickyHeader";
import { useErrorBoundaryGallery } from "./hooks/useErrorBoundaryGallery";
import {
  Search,
  Github,
  ExternalLink,
  X,
  Filter,
  BarChart3,
  Menu,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SNIPPET_CATEGORIES, SNIPPET_FEATURES, SNIPPET_LANGUAGES, SNIPPET_BADGES } from "./lib/constants";
import type { SnippetCategory, SnippetFeature, SnippetLanguage, SnippetBadge } from "./lib/types";

// Loading skeleton for gallery cards
function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-64 animate-pulse">
          <div className="p-6 space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Filter sidebar component
interface FilterSidebarProps {
  availableCategories: SnippetCategory[];
  availableTags: SnippetFeature[];
  availableLanguages: SnippetLanguage[];
  availableBadges: SnippetBadge[];
  selectedCategory: SnippetCategory | null;
  selectedTags: SnippetFeature[];
  selectedLanguages: SnippetLanguage[];
  selectedBadges: SnippetBadge[];
  onCategoryChange: (category: SnippetCategory | null) => void;
  onTagToggle: (tag: SnippetFeature) => void;
  onLanguageToggle: (language: SnippetLanguage) => void;
  onBadgeToggle: (badge: SnippetBadge) => void;
  onClearFilters: () => void;
  stats: {
    total: number;
    filtered: number;
    categories: number;
    tags: number;
    languages: number;
    badges: number;
    hasActiveFilters: boolean;
  };
}

function FilterSidebar({
  availableCategories,
  availableTags,
  availableLanguages,
  availableBadges,
  selectedCategory,
  selectedTags,
  selectedLanguages,
  selectedBadges,
  onCategoryChange,
  onTagToggle,
  onLanguageToggle,
  onBadgeToggle,
  onClearFilters,
  stats,
}: FilterSidebarProps) {
  const [openSection, setOpenSection] = useState<'categories' | 'features' | 'languages' | 'status' | null>('categories');
  
  const toggleSection = (section: 'categories' | 'features' | 'languages' | 'status') => {
    setOpenSection(openSection === section ? null : section);
  };
  
  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedTags.length + selectedLanguages.length + selectedBadges.length;

  return (
    <div className="w-72 sticky top-20 h-fit">
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4 text-primary" />
              Filters
            </CardTitle>
            {stats.hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>{stats.filtered} of {stats.total}</span>
            </div>
            {stats.hasActiveFilters && (
              <Badge variant="secondary" className="text-xs px-1.5">
                {activeFilterCount}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <ScrollArea className="h-[calc(100vh-280px)] pr-3">
            {/* Categories */}
            <Collapsible open={openSection === 'categories'} onOpenChange={() => toggleSection('categories')}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1 -m-1">
                  <div className="flex items-center justify-between w-full">
                    <h4 className="text-xs font-semibold text-foreground">Categories</h4>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs h-4 px-1.5">{availableCategories.length}</Badge>
                      {openSection === 'categories' ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid gap-1 mt-2">
                  {availableCategories.map((category) => {
                    const isSelected = selectedCategory === category;
                    return (
                      <Button
                        key={category}
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start text-xs h-7 px-2 ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted/60"}`}
                        onClick={() => onCategoryChange(isSelected ? null : category)}
                      >
                        {SNIPPET_CATEGORIES[category]}
                      </Button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-4" />

            {/* Features/Tags */}
            <Collapsible open={openSection === 'features'} onOpenChange={() => toggleSection('features')}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1 -m-1">
                  <div className="flex items-center justify-between w-full">
                    <h4 className="text-xs font-semibold">Features</h4>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs h-4 px-1.5">{availableTags.length}</Badge>
                      {openSection === 'features' ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-1 mt-2">
                  {availableTags.slice(0, 20).map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <Badge
                        key={tag}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer text-xs h-5 px-1.5 ${isSelected ? "bg-primary" : "hover:bg-muted/60"}`}
                        onClick={() => onTagToggle(tag)}
                      >
                        {SNIPPET_FEATURES[tag] || tag}
                        {isSelected && <X className="h-2 w-2 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-4" />

            {/* Languages */}
            <Collapsible open={openSection === 'languages'} onOpenChange={() => toggleSection('languages')}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1 -m-1">
                  <div className="flex items-center justify-between w-full">
                    <h4 className="text-xs font-semibold">Languages</h4>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs h-4 px-1.5">{availableLanguages.length}</Badge>
                      {openSection === 'languages' ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-1 mt-2">
                  {availableLanguages.map((language) => {
                    const isSelected = selectedLanguages.includes(language);
                    return (
                      <Badge
                        key={language}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer text-xs h-5 px-1.5 ${isSelected ? "bg-primary" : "hover:bg-muted/60"}`}
                        onClick={() => onLanguageToggle(language)}
                      >
                        {SNIPPET_LANGUAGES[language] || language}
                        {isSelected && <X className="h-2 w-2 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator className="my-4" />

            {/* Badges */}
            <Collapsible open={openSection === 'status'} onOpenChange={() => toggleSection('status')}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1 -m-1">
                  <div className="flex items-center justify-between w-full">
                    <h4 className="text-xs font-semibold">Status</h4>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs h-4 px-1.5">{availableBadges.length}</Badge>
                      {openSection === 'status' ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-wrap gap-1 mt-2">
                  {availableBadges.map((badge) => {
                    const isSelected = selectedBadges.includes(badge);
                    const badgeConfig = SNIPPET_BADGES[badge];
                    return (
                      <Badge
                        key={badge}
                        variant={isSelected ? "default" : badgeConfig?.variant || "outline"}
                        className={`cursor-pointer text-xs h-5 px-1.5 ${isSelected ? "bg-primary" : "hover:bg-muted/60"}`}
                        onClick={() => onBadgeToggle(badge)}
                      >
                        {badgeConfig?.label || badge}
                        {isSelected && <X className="h-2 w-2 ml-1" />}
                      </Badge>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </ScrollArea>

          {stats.hasActiveFilters && (
            <>
              <Separator />
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="w-full h-7 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Mobile Filter Content (same as desktop but without sticky positioning)
function MobileFilterContent({
  availableCategories,
  availableTags,
  availableLanguages,
  availableBadges,
  selectedCategory,
  selectedTags,
  selectedLanguages,
  selectedBadges,
  onCategoryChange,
  onTagToggle,
  onLanguageToggle,
  onBadgeToggle,
  onClearFilters,
  stats,
}: FilterSidebarProps) {
  const [openSection, setOpenSection] = useState<'categories' | 'features' | 'languages' | 'status' | null>('categories');
  
  const toggleSection = (section: 'categories' | 'features' | 'languages' | 'status') => {
    setOpenSection(openSection === section ? null : section);
  };
  
  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedTags.length + selectedLanguages.length + selectedBadges.length;

  return (
    <div className="space-y-4 pl-5">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          <span>{stats.filtered} of {stats.total}</span>
        </div>
        {stats.hasActiveFilters && (
          <Badge variant="secondary" className="text-xs px-1.5">
            {activeFilterCount}
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[60vh] pr-3">
        {/* Categories */}
        <Collapsible open={openSection === 'categories'} onOpenChange={() => toggleSection('categories')}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1 -m-1">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-xs font-semibold">Categories</h4>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs h-4 px-1.5">{availableCategories.length}</Badge>
                  {openSection === 'categories' ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-1 mt-2">
              {availableCategories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <Button
                    key={category}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start text-xs h-7 px-2 ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted/60"}`}
                    onClick={() => onCategoryChange(isSelected ? null : category)}
                  >
                    {SNIPPET_CATEGORIES[category]}
                  </Button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-4" />

        {/* Features/Tags */}
        <Collapsible open={openSection === 'features'} onOpenChange={() => toggleSection('features')}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1 -m-1">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-xs font-semibold">Features</h4>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs h-4 px-1.5">{availableTags.length}</Badge>
                  {openSection === 'features' ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-1 mt-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer text-xs h-5 px-1.5 ${isSelected ? "bg-primary" : "hover:bg-muted/60"}`}
                    onClick={() => onTagToggle(tag)}
                  >
                    {SNIPPET_FEATURES[tag] || tag}
                    {isSelected && <X className="h-2 w-2 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-4" />

        {/* Languages */}
        <Collapsible open={openSection === 'languages'} onOpenChange={() => toggleSection('languages')}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1 -m-1">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-xs font-semibold">Languages</h4>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs h-4 px-1.5">{availableLanguages.length}</Badge>
                  {openSection === 'languages' ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-1 mt-2">
              {availableLanguages.map((language) => {
                const isSelected = selectedLanguages.includes(language);
                return (
                  <Badge
                    key={language}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer text-xs h-5 px-1.5 ${isSelected ? "bg-primary" : "hover:bg-muted/60"}`}
                    onClick={() => onLanguageToggle(language)}
                  >
                    {SNIPPET_LANGUAGES[language] || language}
                    {isSelected && <X className="h-2 w-2 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="my-4" />

        {/* Badges */}
        <Collapsible open={openSection === 'status'} onOpenChange={() => toggleSection('status')}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between hover:bg-muted/50 rounded-md p-1 -m-1">
              <div className="flex items-center justify-between w-full">
                <h4 className="text-xs font-semibold">Status</h4>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs h-4 px-1.5">{availableBadges.length}</Badge>
                  {openSection === 'status' ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-1 mt-2">
              {availableBadges.map((badge) => {
                const isSelected = selectedBadges.includes(badge);
                const badgeConfig = SNIPPET_BADGES[badge];
                return (
                  <Badge
                    key={badge}
                    variant={isSelected ? "default" : badgeConfig?.variant || "outline"}
                    className={`cursor-pointer text-xs h-5 px-1.5 ${isSelected ? "bg-primary" : "hover:bg-muted/60"}`}
                    onClick={() => onBadgeToggle(badge)}
                  >
                    {badgeConfig?.label || badge}
                    {isSelected && <X className="h-2 w-2 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </ScrollArea>

      {stats.hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full h-7 text-xs hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const {
    searchQuery,
    selectedCategory,
    selectedTags,
    selectedLanguages,
    selectedBadges,
    filteredSnippets,
    isLoading,
    error,
    handleSearchChange,
    handleCategoryChange,
    handleTagToggle,
    handleLanguageToggle,
    handleBadgeToggle,
    clearAllFilters,
    availableCategories,
    availableTags,
    availableLanguages,
    availableBadges,
    stats,
  } = useErrorBoundaryGallery({ snippets });

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #ec4899 100%)
      `,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="min-h-screen">
        {/* Header Banner */}
        <HeaderBanner totalTemplates={stats.total} />

        {/* Sticky Header */}
        <StickyHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex gap-8 relative">
            {/* Filter Sidebar */}
            <aside className="hidden lg:block shrink-0">
              <FilterSidebar
                availableCategories={availableCategories}
                availableTags={availableTags}
                availableLanguages={availableLanguages}
                availableBadges={availableBadges}
                selectedCategory={selectedCategory}
                selectedTags={selectedTags}
                selectedLanguages={selectedLanguages}
                selectedBadges={selectedBadges}
                onCategoryChange={handleCategoryChange}
                onTagToggle={handleTagToggle}
                onLanguageToggle={handleLanguageToggle}
                onBadgeToggle={handleBadgeToggle}
                onClearFilters={clearAllFilters}
                stats={stats}
              />
            </aside>

            {/* Gallery Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {stats.hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {(selectedCategory ? 1 : 0) + selectedTags.length + selectedLanguages.length + selectedBadges.length}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 sm:w-96">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        Filters
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <MobileFilterContent
                        availableCategories={availableCategories}
                        availableTags={availableTags}
                        availableLanguages={availableLanguages}
                        availableBadges={availableBadges}
                        selectedCategory={selectedCategory}
                        selectedTags={selectedTags}
                        selectedLanguages={selectedLanguages}
                        selectedBadges={selectedBadges}
                        onCategoryChange={handleCategoryChange}
                        onTagToggle={handleTagToggle}
                        onLanguageToggle={handleLanguageToggle}
                        onBadgeToggle={handleBadgeToggle}
                        onClearFilters={clearAllFilters}
                        stats={stats}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Search results info */}
              {(searchQuery || stats.hasActiveFilters) && (
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-muted-foreground">
                    {filteredSnippets.length === 0
                      ? `No results found`
                      : `Found ${filteredSnippets.length} result${
                          filteredSnippets.length === 1 ? "" : "s"
                        }`}
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                  {stats.hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="self-start sm:self-auto"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <X className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Error loading templates
                  </h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Reload page
                  </Button>
                </div>
              )}

              {/* Gallery Grid */}
              {!error && (
                <Suspense fallback={<GallerySkeleton />}>
                  {isLoading ? (
                    <GallerySkeleton />
                  ) : filteredSnippets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredSnippets.map((snippet) => (
                        <LazyErrorBoundaryCard
                          key={snippet.id}
                          snippet={snippet}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No templates found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search terms or browse all templates.
                      </p>
                      <Button onClick={clearAllFilters} variant="outline">
                        Clear Search
                      </Button>
                    </div>
                  )}
                </Suspense>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card/50 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-muted-foreground">
                  {"<"}Fallbacks{" />"} &copy; {new Date().getFullYear()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ready-to-use error boundary templates for React applications
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://github.com/kdjadeja21/fallbacks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    React Docs
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Scroll to Top Component */}
        <ScrollToTop />
      </div>
    </div>
  );
}

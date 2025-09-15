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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SNIPPET_CATEGORIES, SNIPPET_FEATURES } from "./lib/constants";
import type { SnippetCategory, SnippetFeature } from "./lib/types";

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
  selectedCategory: SnippetCategory | null;
  selectedTags: SnippetFeature[];
  onCategoryChange: (category: SnippetCategory | null) => void;
  onTagToggle: (tag: SnippetFeature) => void;
  onClearFilters: () => void;
  stats: {
    total: number;
    filtered: number;
    categories: number;
    tags: number;
    hasActiveFilters: boolean;
  };
}

function FilterSidebar({
  availableCategories,
  availableTags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  onClearFilters,
  stats,
}: FilterSidebarProps) {
  return (
    <div className="w-72 sticky top-20 h-fit">
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
            {stats.hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Stats Summary */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>
                {stats.filtered} of {stats.total}
              </span>
            </div>
            {stats.hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {(selectedCategory ? 1 : 0) + selectedTags.length} active
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            {/* Categories Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Categories
                </h4>
                <Badge variant="outline" className="text-xs">
                  {availableCategories.length}
                </Badge>
              </div>

              <div className="grid gap-2">
                {availableCategories.map((category) => {
                  const isSelected = selectedCategory === category;
                  const categoryCount = snippets.filter(
                    (s) => s.category === category
                  ).length;

                  return (
                    <Button
                      key={category}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-between text-sm h-9 px-3 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted/80"
                      }`}
                      onClick={() =>
                        onCategoryChange(isSelected ? null : category)
                      }
                    >
                      <span className="truncate">
                        {SNIPPET_CATEGORIES[category]}
                      </span>
                      <Badge
                        variant={isSelected ? "secondary" : "outline"}
                        className="text-xs ml-2 shrink-0"
                      >
                        {categoryCount}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Features/Tags Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Features
                </h4>
                <Badge variant="outline" className="text-xs">
                  {availableTags.length}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 24).map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  const tagCount = snippets.filter((s) =>
                    s.features?.includes(tag)
                  ).length;

                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer text-xs transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted/80 hover:border-primary/50"
                      }`}
                      onClick={() => onTagToggle(tag)}
                      title={`${
                        SNIPPET_FEATURES[tag] || tag
                      } (${tagCount} templates)`}
                    >
                      {SNIPPET_FEATURES[tag] || tag}
                      {isSelected && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  );
                })}

                {availableTags.length > 24 && (
                  <Badge variant="outline" className="text-xs cursor-default">
                    +{availableTags.length - 24} more
                  </Badge>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Clear All Button */}
          {stats.hasActiveFilters && (
            <>
              <Separator />
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
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
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  onClearFilters,
  stats,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <BarChart3 className="h-4 w-4" />
          <span>
            {stats.filtered} of {stats.total}
          </span>
        </div>
        {stats.hasActiveFilters && (
          <Badge variant="secondary" className="text-xs">
            {(selectedCategory ? 1 : 0) + selectedTags.length} active
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[60vh] pr-4">
        {/* Categories Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              Categories
            </h4>
            <Badge variant="outline" className="text-xs">
              {availableCategories.length}
            </Badge>
          </div>

          <div className="grid gap-2">
            {availableCategories.map((category) => {
              const isSelected = selectedCategory === category;
              const categoryCount = snippets.filter(
                (s) => s.category === category
              ).length;

              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-between text-sm h-9 px-3 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/80"
                  }`}
                  onClick={() => onCategoryChange(isSelected ? null : category)}
                >
                  <span className="truncate">
                    {SNIPPET_CATEGORIES[category]}
                  </span>
                  <Badge
                    variant={isSelected ? "secondary" : "outline"}
                    className="text-xs ml-2 shrink-0"
                  >
                    {categoryCount}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Features/Tags Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Features</h4>
            <Badge variant="outline" className="text-xs">
              {availableTags.length}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const tagCount = snippets.filter((s) =>
                s.features?.includes(tag)
              ).length;

              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer text-xs transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted/80 hover:border-primary/50"
                  }`}
                  onClick={() => onTagToggle(tag)}
                  title={`${
                    SNIPPET_FEATURES[tag] || tag
                  } (${tagCount} templates)`}
                >
                  {SNIPPET_FEATURES[tag] || tag}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Clear All Button */}
      {stats.hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
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
    filteredSnippets,
    isLoading,
    error,
    handleSearchChange,
    handleCategoryChange,
    handleTagToggle,
    clearAllFilters,
    availableCategories,
    availableTags,
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
                selectedCategory={selectedCategory}
                selectedTags={selectedTags}
                onCategoryChange={handleCategoryChange}
                onTagToggle={handleTagToggle}
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
                          {(selectedCategory ? 1 : 0) + selectedTags.length}
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
                        selectedCategory={selectedCategory}
                        selectedTags={selectedTags}
                        onCategoryChange={handleCategoryChange}
                        onTagToggle={handleTagToggle}
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
                  Built with Next.js, React, TypeScript, and Tailwind CSS
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ready-to-use error boundary templates for React applications
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://github.com"
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
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge"

interface HeaderBannerProps {
  totalTemplates: number
}

export function HeaderBanner({ totalTemplates }: HeaderBannerProps) {
  return (
    <div className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Enhanced Animated Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-purple-500/30 to-orange-500/15 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 via-teal-500/15 to-cyan-500/20 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-violet-600/25 to-pink-600/20 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.4),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(236,72,153,0.25),transparent_50%)]"></div>
      
      {/* Enhanced floating geometric shapes - responsive positioning */}
      <div className="absolute top-10 left-4 sm:top-20 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute top-20 right-4 sm:top-40 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-lg animate-pulse"></div>
      <div className="absolute bottom-10 left-4 sm:bottom-20 sm:left-20 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-500/20 to-orange-500/10 rounded-full blur-2xl animate-bounce delay-100"></div>
      <div className="absolute bottom-20 right-2 sm:bottom-40 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 rounded-full blur-lg animate-pulse delay-200"></div>
      <div className="hidden sm:block absolute top-1/2 left-1/4 w-8 h-8 bg-gradient-to-br from-violet-500/15 to-indigo-500/10 rounded-full blur-md animate-ping"></div>
      <div className="hidden sm:block absolute top-1/3 right-1/3 w-14 h-14 bg-gradient-to-br from-teal-500/15 to-green-500/10 rounded-full blur-lg animate-bounce delay-300"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto">
          
          {/* Main heading with enhanced styling */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-white/90">Production Ready</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight font-sans tracking-tight">
              {"<"}Fallbacks{"/>"}
            </h1>
            
            <div className="relative">
              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 mb-4 sm:mb-6 px-2 sm:px-0">
                A Gallery of React Error Boundary Templates
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform translate-x-1 sm:translate-x-2 w-24 sm:w-32 md:w-40 h-0.5 sm:h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Enhanced description */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light px-2 sm:px-0">
              A comprehensive collection of <span className="font-semibold text-blue-300">{totalTemplates}</span> production-ready 
              error boundary components for modern React applications.
            </p>
            
            <p className="text-base sm:text-lg text-white/70 max-w-3xl mx-auto px-2 sm:px-0">
              Crafted with precision using TypeScript and Tailwind CSS for seamless integration into your projects.
            </p>
          </div>

          {/* Enhanced badges with better styling */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap mt-8 sm:mt-12 px-2 sm:px-0">
            <Badge className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg">
              {totalTemplates} Templates
            </Badge>
            <Badge variant="outline" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 border-white/30 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              TypeScript
            </Badge>
            <Badge variant="outline" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 border-white/30 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              Tailwind CSS
            </Badge>
            <Badge variant="outline" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 border-white/30 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              Copy & Paste
            </Badge>
          </div>

          {/* Call-to-action section */}
          <div className="mt-12 sm:mt-16 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0">
              <button className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-white to-gray-100 text-black font-semibold rounded-xl hover:from-gray-50 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-2xl">
                <span className="relative z-10 text-sm sm:text-base">Browse Templates</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
              
              <a 
                href="https://github.com/kdjadeja21/fallbacks?tab=readme-ov-file#contributing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base">Contribute here</span>
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-white/60 mt-6 sm:mt-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Always Updated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/60 to-transparent"></div>
    </div>
  )
}

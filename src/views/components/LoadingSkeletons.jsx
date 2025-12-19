
export const SkeletonBlock = ({ className }) => (
  <div className={`bg-gray-700/50 animate-pulse rounded-xl ${className}`}></div>
);

export const CourseCardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-gray-800 border border-gray-700 h-[280px] flex flex-col relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-700/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
    <SkeletonBlock className="w-14 h-14 mb-4" /> 
    <SkeletonBlock className="h-8 w-3/4 mb-2" /> 
    <SkeletonBlock className="h-4 w-full mb-2" /> 
    <SkeletonBlock className="h-4 w-5/6 mb-6" /> 
    <div className="mt-auto flex items-center gap-2">
       <SkeletonBlock className="h-4 w-24" />
    </div>
  </div>
);

export const UnitRowSkeleton = () => (
  <div className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 space-y-4">
    <div className="flex justify-between items-center">
        <div className="space-y-2 w-1/2">
            <SkeletonBlock className="h-8 w-2/3" />
            <SkeletonBlock className="h-4 w-full" />
        </div>
        <SkeletonBlock className="h-6 w-20 rounded-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonBlock className="h-20 w-full" />
        <SkeletonBlock className="h-20 w-full" />
    </div>
  </div>
);


export const MissionSkeleton = () => (
  <div className="min-h-screen bg-gray-900 p-6 flex flex-col items-center">
    <div className="w-full max-w-3xl space-y-8 mt-10">
        <SkeletonBlock className="h-64 w-full rounded-3xl" />
        <div className="space-y-4">
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-16 w-full" />
        </div>
    </div>
  </div>
);


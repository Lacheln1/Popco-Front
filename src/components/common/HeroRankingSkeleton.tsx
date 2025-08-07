const PosterSkeleton = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative aspect-[7/10] w-full overflow-hidden rounded-lg bg-gray-200">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />
      </div>
      <div className="mt-2 space-y-1">
        <div className="relative h-3 w-3/4 overflow-hidden rounded bg-gray-200">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const HeroRankingSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-3 md:px-6 lg:px-0">
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <section className="mt-6">
        <div className="relative text-white">
          <div className="relative h-48 w-full overflow-hidden bg-gray-300 sm:h-64 md:h-80 lg:h-96">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                backgroundSize: "200% 100%",
                animation: "shimmer 2s infinite",
              }}
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 sm:flex-row sm:gap-6 md:gap-14 md:py-10">
            <div className="relative h-32 w-24 overflow-hidden rounded-md bg-gray-400 sm:h-[85%] sm:w-40 md:h-[90%] md:w-48">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
            <div className="w-full max-w-full flex-1 md:max-w-[510px]">
              <div className="flex flex-col items-center gap-2 border-b border-gray-400 pb-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded bg-gray-400 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
                <div className="relative h-6 w-32 overflow-hidden rounded bg-gray-400 sm:h-8 sm:flex-1 lg:h-10">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 border-b p-2 sm:justify-start sm:border-none sm:py-4 md:flex-row md:gap-8">
                <div className="flex justify-center gap-2 sm:justify-start sm:gap-5">
                  <div className="relative h-4 w-16 overflow-hidden rounded bg-gray-400 sm:h-5 sm:w-20">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </div>
                  <div className="relative h-4 w-8 overflow-hidden rounded bg-gray-400 sm:h-5 sm:w-12">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-center gap-2 sm:justify-start sm:gap-5">
                  <div className="relative h-4 w-12 overflow-hidden rounded bg-gray-400 sm:h-5 sm:w-16">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </div>
                  <div className="relative h-4 w-16 overflow-hidden rounded bg-gray-400 sm:h-5 sm:w-24">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="my-4 hidden space-y-2 sm:block">
                <div className="relative h-3 w-full overflow-hidden rounded bg-gray-400 sm:h-4">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
                <div className="relative h-3 w-3/4 overflow-hidden rounded bg-gray-400 sm:h-4">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              </div>
              <div className="relative mx-auto mt-2 h-8 w-24 overflow-hidden rounded-full bg-gray-400 sm:mx-0 sm:h-10 sm:w-32">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-12">
          <div className="hidden sm:flex sm:justify-between sm:gap-4 lg:gap-6">
            {[2, 3, 4, 5].map((rank) => (
              <div key={rank} className="relative flex flex-col items-center">
                <div className="absolute -left-8 -top-4 z-10 h-12 w-8 overflow-hidden rounded bg-gray-300 md:h-16 md:w-12 lg:h-20 lg:w-16">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
                <PosterSkeleton className="h-48 w-32 sm:h-56 sm:w-36 md:h-64 md:w-44 lg:h-72 lg:w-48" />
                <div className="relative mt-2 h-5 w-5 overflow-hidden rounded-full bg-gray-300 sm:h-6 sm:w-6">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 justify-items-center gap-4 sm:hidden">
            {[2, 3, 4, 5].map((rank) => (
              <div key={rank} className="relative flex flex-col items-center">
                <div className="absolute -left-6 -top-3 z-10 h-8 w-6 overflow-hidden rounded bg-gray-300">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
                <PosterSkeleton className="xs:h-48 xs:w-32 h-40 w-28" />
                <div className="xs:h-5 xs:w-5 relative mt-1 h-4 w-4 overflow-hidden rounded-full bg-gray-300">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroRankingSkeleton;

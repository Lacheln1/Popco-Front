const TimeBlock = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-footer-blue text-[10px] tracking-wide md:text-xs">
      {label}
    </span>
    <div className="relative flex h-[65px] w-[60px] items-center justify-center rounded-lg text-4xl font-bold text-white shadow-lg md:h-[80px] md:w-[72px]">
      {/* 상단 어두운 배경 */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#7577AC] to-[#172039]" />
      {/* 하단 오버레이 */}
      <div className="absolute bottom-0 h-1/2 w-full rounded-b-lg bg-black/10" />
      {/* 시간 */}
      <span className="relative z-10">{value}</span>
    </div>
  </div>
);

export default TimeBlock;

export function IncomeSustainabilityCard() {
  return (
    <div className="group relative h-40 cursor-pointer overflow-hidden rounded-3xl">
      <img
        alt="Forest sanctuary"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKCLv9rVVZip8VkpeettPL0xvygff2K6Khdckq7jR1krojg4UKOdOkX3dM4poBbnITWTEfSP0DFvO1nUHhIkXzp14f_wIgOwQCHoMLCC1K1SZVESIXMww9uO7rIB590CVrgJ2XAhwbm3GD4ijyZBrbuSVGqsa_7Ci-4t58tZS9dT5BezGz9UYyAXdD4s9uT-zcW7xBK5dfgAAddTFq-8WoyX048yiqGn84TYxzl1BnYN08LYWRdneXoa6SiU5lArEfnilIVbQwavg"
      />
      <div className="absolute inset-0 flex flex-col justify-center bg-linear-to-r from-emerald-950/80 to-transparent px-10">
        <h5 className="font-display text-xl font-bold text-on-primary">Sustainability Goal</h5>
        <p className="mt-1 text-sm text-on-primary opacity-80">You've saved enough for 12 new saplings this month.</p>
        <button type="button" className="mt-4 w-fit rounded-full bg-on-tertiary-fixed px-4 py-2 text-xs font-bold text-on-primary">
          Contribute Now
        </button>
      </div>
    </div>
  )
}
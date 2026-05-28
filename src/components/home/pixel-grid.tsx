import { PIXEL_GRID_BRIGHT_THRESHOLD } from "./constants";

export function PixelGrid() {
  return (
    <div className="grid h-full place-items-center opacity-20">
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: 64 }).map((_, index) => (
          <span
            className="h-1.5 w-1.5 bg-current"
            key={`placeholder-${index}`}
            style={{
              opacity:
                (index * 17 + 11) % 10 > PIXEL_GRID_BRIGHT_THRESHOLD ? 1 : 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

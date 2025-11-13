import { formatDuration, getImageUrl } from ".";
import type { LastFmImage } from "../types/lastfm";

describe("Utility Functions", () => {
  describe("getImageUrl", () => {
    const mockImages: LastFmImage[] = [
      { size: "small", "#text": "url-small" },
      { size: "medium", "#text": "url-medium" },
      { size: "large", "#text": "url-large" },
    ];

    test('should return the URL for the "large" size when available', () => {
      expect(getImageUrl(mockImages)).toBe("url-large");
    });

    test("should return an empty string for an empty array", () => {
      expect(getImageUrl([])).toBe("");
    });
  });

  describe("formatDuration", () => {
    test("should format 0 seconds correctly", () => {
      expect(formatDuration("0")).toBe("0:00");
    });

    test("should format durations less than one minute with leading zero for seconds", () => {
      expect(formatDuration("5")).toBe("0:05");
      expect(formatDuration("30")).toBe("0:30");
    });

    test("should format durations exactly one minute (60 seconds)", () => {
      expect(formatDuration("60")).toBe("1:00");
    });
  });
});

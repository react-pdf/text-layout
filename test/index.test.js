import createFontSubstitutionEngine from '../src/font-substitution/index';
import StandardFont from '../src/font-substitution/standardFont';

class Run {
  constructor(start, end, attributes = {}) {
    this.start = start;
    this.end = end;
    this.attributes = attributes;
  }
}

// For testing purposes, we define that the embeded font
// does not have the white space as a valid character.
class EmbededFont {
  hasGlyphForCodePoint(codePoint) {
    return codePoint !== 32 && codePoint !== 8232;
  }
}

const FontSubstitution = createFontSubstitutionEngine()({ Run });
const instance = new FontSubstitution();

describe('FontSubstitutionEngine', () => {
  test('should return empty array if no runs passed', () => {
    const runs = instance.getRuns('', []);

    expect(runs).toEqual([]);
  });

  test('should return empty run for empty string', () => {
    const run = new Run(0, 0);
    const runs = instance.getRuns('', [run]);

    expect(runs).toHaveLength(1);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(0);
  });

  test('should keep embeded font on runs', () => {
    const attrs = { font: new EmbededFont() };
    const run = new Run(0, 5, attrs);
    const runs = instance.getRuns('Lorem', [run]);

    expect(runs).toHaveLength(1);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(5);
    expect(runs[0].attributes).toEqual(attrs);
  });

  test('should ignore ignorable chars in the middle of text', () => {
    const attrs = { font: new EmbededFont() };
    const run = new Run(0, 11, attrs);
    const runs = instance.getRuns('Lorem\u2028ipsum', [run]);

    expect(runs).toHaveLength(2);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(5);
    expect(runs[1].start).toBe(6);
    expect(runs[1].end).toBe(11);
    expect(runs[0].attributes).toEqual(attrs);
    expect(runs[1].attributes).toEqual(attrs);
  });

  test('should ignore ignorable chars at the beggining of text', () => {
    const attrs = { font: new EmbededFont() };
    const run = new Run(0, 6, attrs);
    const runs = instance.getRuns('\u2028ipsum', [run]);

    expect(runs).toHaveLength(1);
    expect(runs[0].start).toBe(1);
    expect(runs[0].end).toBe(6);
    expect(runs[0].attributes).toEqual(attrs);
  });

  test('should ignore ignorable chars at the end of text', () => {
    const attrs = { font: new EmbededFont() };
    const run = new Run(0, 6, attrs);
    const runs = instance.getRuns('Lorem\u2028', [run]);

    expect(runs).toHaveLength(1);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(5);
    expect(runs[0].attributes).toEqual(attrs);
  });

  test('should ignore two consecutive ignorable chars', () => {
    const attrs = { font: new EmbededFont() };
    const run = new Run(0, 6, attrs);
    const runs = instance.getRuns('Lorem\u2028\u2028', [run]);

    expect(runs).toHaveLength(1);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(5);
    expect(runs[0].attributes).toEqual(attrs);
  });

  test('should substitute standard font', () => {
    const attrs = { font: 'Helvetica' };
    const run = new Run(0, 5, attrs);
    const runs = instance.getRuns('Lorem', [run]);

    expect(runs).toHaveLength(1);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(5);
    expect(runs[0].attributes.font).toBeInstanceOf(StandardFont);
  });

  test('should use fallback font if char not present', () => {
    const attrs = { font: new EmbededFont() };
    const run = new Run(0, 11, attrs);
    const runs = instance.getRuns('Lorem ipsum', [run]);

    expect(runs).toHaveLength(3);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(5);
    expect(runs[1].start).toBe(5);
    expect(runs[1].end).toBe(6);
    expect(runs[2].start).toBe(6);
    expect(runs[2].end).toBe(11);
    expect(runs[0].attributes).toEqual(attrs);
    expect(runs[1].attributes.font).toBeInstanceOf(StandardFont);
    expect(runs[2].attributes).toEqual(attrs);
  });

  test('should merge equal runs', () => {
    const attrs = { font: new EmbededFont() };
    const run1 = new Run(0, 3, attrs);
    const run2 = new Run(3, 5, attrs);
    const runs = instance.getRuns('Lorem', [run1, run2]);

    expect(runs).toHaveLength(1);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(5);
    expect(runs[0].attributes).toEqual(attrs);
  });

  test('should substitute many runs', () => {
    const run1 = new Run(0, 3, { font: new EmbededFont() });
    const run2 = new Run(3, 5, { font: 'Helvetica'});
    const runs = instance.getRuns('Lorem', [run1, run2]);

    expect(runs).toHaveLength(2);
    expect(runs[0].start).toBe(0);
    expect(runs[0].end).toBe(3);
    expect(runs[1].start).toBe(3);
    expect(runs[1].end).toBe(5);
  });
});

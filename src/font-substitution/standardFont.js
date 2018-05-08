import PDFFont from '@react-pdf/pdfkit/js/font';

class StandardFont {
  constructor(src) {
    this.name = src;
    this.src = PDFFont.open(null, src);
  }

  layout(str) {
    const [encoded, positions] = this.src.encode(str);

    return {
      positions,
      stringIndices: positions.map((_, i) => i),
      glyphs: encoded.map((g, i) => ({
        id: g,
        _font: this.src,
        advanceWidth: positions[i].advanceWidth,
      })),
    }
  }

  glyphForCodePoint(codePoint) {
    return this.getGlyph({ id: codePoint, _font: this.src, advanceWidth: 400 });
  }

  getGlyph(glyph) {
    return glyph;
  }

  hasGlyphForCodePoint(codePoint) {
    return this.src.font.characterToGlyph(codePoint) !== '.notdef';
  }

  get ascent() {
    return this.src.ascender;
  }

  get descent() {
    return this.src.descender;
  }

  get lineGap() {
    return this.src.lineGap;
  }

  get unitsPerEm() {
    return 1000;
  }
}

export default StandardFont;

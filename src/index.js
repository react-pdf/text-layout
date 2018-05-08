import tabEngine from '@textkit/tab-engine';
import scriptItemizer from '@textkit/script-itemizer';
import truncationEngine from '@textkit/truncation-engine';
import justificationEngine from '@textkit/justification-engine';
import textDecorationEngine from '@textkit/text-decoration-engine';
import lineFragmentGenerator from '@textkit/line-fragment-generator';
import { LayoutEngine as BaseLayoutEngine } from '@textkit/core';
import lineBreaker from './linebreaker';
import fontSubstitutionEngine from './font-substitution';

// justificationEngine values
const shrinkWhitespaceFactor = { before: -0.5, after: -0.5 };

export class LayoutEngine extends BaseLayoutEngine {
  constructor({ hyphenationCallback }) {
    const engines = {
      tabEngine: tabEngine(),
      scriptItemizer: scriptItemizer(),
      truncationEngine: truncationEngine(),
      decorationEngine: textDecorationEngine(),
      lineFragmentGenerator: lineFragmentGenerator(),
      fontSubstitutionEngine: fontSubstitutionEngine(),
      lineBreaker: lineBreaker({ hyphenationCallback }),
      justificationEngine: justificationEngine({ shrinkWhitespaceFactor }),
    };

    super(engines);
  }
}

export { Path, TabStop, Container, Attachment, AttributedString } from '@textkit/core';

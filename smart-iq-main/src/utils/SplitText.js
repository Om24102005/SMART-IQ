/**
 * Lightweight SplitText utility
 * Wraps each character, word, and line in <span> elements
 * for GSAP character-level animations.
 */
export class SplitText {
  constructor(element, options = {}) {
    this.element = element
    this.type = options.type || 'chars,words,lines'
    this.charsClass = options.charsClass || 'gs-char'
    this.wordsClass = options.wordsClass || 'gs-word'
    this.linesClass = options.linesClass || 'gs-line'

    this.chars = []
    this.words = []
    this.lines = []

    this._split()
  }

  _split() {
    const text = this.element.textContent || this.element.innerText || ''
    const originalHTML = this.element.innerHTML

    // Store original for revert
    this._originalHTML = originalHTML

    const types = this.type.split(',').map(t => t.trim())

    if (types.includes('chars')) {
      this._splitChars(text)
    } else if (types.includes('words')) {
      this._splitWords(text)
    } else if (types.includes('lines')) {
      this._splitLines(text)
    }
  }

  _splitChars(text) {
    const chars = text.split('').map((char, i) => {
      if (char === ' ') return ' '
      const span = document.createElement('span')
      span.className = this.charsClass
      span.textContent = char
      span.style.display = 'inline-block'
      this.chars.push(span)
      return span.outerHTML
    })
    this.element.innerHTML = chars.join('')
  }

  _splitWords(text) {
    const words = text.split(/\s+/).map((word, i) => {
      const span = document.createElement('span')
      span.className = this.wordsClass
      span.textContent = word
      span.style.display = 'inline-block'
      this.words.push(span)
      return span.outerHTML
    })
    this.element.innerHTML = words.join(' ')
  }

  _splitLines(text) {
    // Simple line split based on <br> or block elements
    const lines = text.split('\n').map((line, i) => {
      const span = document.createElement('span')
      span.className = this.linesClass
      span.textContent = line
      span.style.display = 'block'
      this.lines.push(span)
      return span.outerHTML
    })
    this.element.innerHTML = lines.join('')
  }

  revert() {
    if (this._originalHTML) {
      this.element.innerHTML = this._originalHTML
    }
    this.chars = []
    this.words = []
    this.lines = []
  }
}

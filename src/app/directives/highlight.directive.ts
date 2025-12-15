import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {
  @Input('appHighlight') searchTerm: string = '';
  @Input() caseSensitive: boolean = false;

  private originalContent: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Store original content when directive is first applied
    this.originalContent = this.el.nativeElement.textContent || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm']) {
      this.highlightText();
    }
  }

  private highlightText(): void {
    const element = this.el.nativeElement;

    // Reset to original content first
    if (this.originalContent) {
      element.textContent = this.originalContent;
    } else {
      this.originalContent = element.textContent || '';
    }

    // Only proceed if there's a search term and original content
    if (!this.searchTerm || !this.originalContent.trim()) {
      return;
    }

    const text = this.originalContent;
    const searchTerm = this.caseSensitive ? this.searchTerm : this.searchTerm.toLowerCase();
    const textToSearch = this.caseSensitive ? text : text.toLowerCase();

    // Find all matches
    const regex = new RegExp(this.escapeRegExp(searchTerm), this.caseSensitive ? 'g' : 'gi');
    const matches = text.match(regex);

    if (matches && matches.length > 0) {
      // Replace matches with highlighted version
      let highlightedText = text;
      matches.forEach((match) => {
        const highlightedMatch = `<mark class="bg-yellow-200 px-1 rounded">${match}</mark>`;
        highlightedText = highlightedText.replace(
          new RegExp(this.escapeRegExp(match), this.caseSensitive ? 'g' : 'gi'),
          highlightedMatch
        );
      });

      // Set the highlighted HTML
      this.renderer.setProperty(element, 'innerHTML', highlightedText);
    }
  }

  private escapeRegExp(string: string): string {
    // Escape special regex characters
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Method to update original content if the element content changes externally
  updateOriginalContent(newContent: string): void {
    this.originalContent = newContent;
    this.highlightText();
  }
}

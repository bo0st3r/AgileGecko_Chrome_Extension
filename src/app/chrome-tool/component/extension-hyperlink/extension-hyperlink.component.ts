import {Component, Input} from '@angular/core';
import {TabManagerService} from '../../../chrome/util/tab/tab-manager.service';

@Component({
  selector: 'r-extension-hyperlink',
  templateUrl: './extension-hyperlink.component.html',
  styleUrls: ['./extension-hyperlink.component.css']
})
/**
 * Hyperlink for Chrome extensions as a text or image.
 *
 * To use as an image, must
 */
export class ExtensionHyperlinkComponent {
  @Input()
  public disabled: boolean;
  @Input()
  public href: string;

  constructor(public tabManagerService: TabManagerService) {
  }

  /**
   * Opens a tab if {@link href} is set.
   */
  public openTab() {
    if (this.disabled || !this.href) {
      return;
    }

    if (this.href.length > 0) {
      this.tabManagerService.openTab(this.href);
    }
  }
}


import {Component, Input, OnInit} from '@angular/core';
import {TabManagerService} from '../../../chrome/util/tab/tab-manager.service';

@Component({
  selector: 'r-extension-hyperlink',
  templateUrl: './extension-hyperlink.component.html',
  styleUrls: ['./extension-hyperlink.component.css']
})
export class ExtensionHyperlinkComponent {
  @Input()
  public disabled: boolean;
  @Input()
  public url: string;
  @Input()
  public text: string;

  @Input()
  public isImg: boolean = false;
  @Input()
  public alt: string;
  @Input()
  public src: string;
  @Input()
  public imgStyle: string;


  constructor(public tabManagerService: TabManagerService) {
  }

  public openTab() {
    if (this.disabled || !this.url) {
      return;
    }

    if (this.url.length > 0) {
      this.tabManagerService.openTab(this.url);
    }
  }
}

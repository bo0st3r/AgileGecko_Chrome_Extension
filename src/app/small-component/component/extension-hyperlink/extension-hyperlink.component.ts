import {Component, Input, OnInit} from '@angular/core';
import {TabManagerService} from '../../../chrome/util/tab-manager.service';

@Component({
  selector: 'ag-extension-hyperlink',
  templateUrl: './extension-hyperlink.component.html',
  styleUrls: ['./extension-hyperlink.component.css']
})
export class ExtensionHyperlinkComponent implements OnInit {
  @Input()
  public disabled: boolean;
  @Input()
  public url: string;
  @Input()
  public text: string;

  constructor(public tabManagerService:TabManagerService) { }

  ngOnInit(): void {
  }

  public openTab(){
    if(this.disabled || !this.url)
      return;

    if(this.url.length > 0){
      this.tabManagerService.openTab(this.url);
    }
  }
}

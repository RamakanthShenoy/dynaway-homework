import { Component } from '@angular/core'
import { Asset } from '../shared/models/asset.model'
import { AssetService } from '../shared/services/asset.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  assets: Asset[] = []
  errorMessage: string = ""
  isAlertOpen = false;
  alertButtons = ['Ok'];

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  constructor(private assetService: AssetService) {}

  ionViewWillEnter(): void {
    this.assets = []
    this.errorMessage = "";
    this.assetService.getAll().subscribe(
      {
        next: (assets) => {this.assets = assets;},
        error: (error) => {
          this.errorMessage = error.message;
          this.setOpen(true);
      }
    }
    )
  }
}

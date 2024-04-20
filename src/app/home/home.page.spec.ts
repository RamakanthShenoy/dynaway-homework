import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'
import { HomePage } from './home.page'
import { AssetService } from '../shared/services/asset.service'
import { Asset } from '../shared/models/asset.model'
import { of } from 'rxjs/internal/observable/of'
import { throwError } from 'rxjs/internal/observable/throwError'
import { AssetCardComponent } from './asset-card/asset-card.component'

describe('HomePage', () => {
  let component: HomePage
  let fixture: ComponentFixture<HomePage>
  let assetService: AssetService;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage,AssetCardComponent],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: AssetService, useValue: { getAll: jasmine.createSpy('getAll') } }] // Mock AssetService
    }).compileComponents()

    fixture = TestBed.createComponent(HomePage)
    component = fixture.componentInstance
    assetService = TestBed.inject(AssetService);
    //assetService = fixture.debugElement.injector.get(AssetService); // one more way
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch assets on ionViewWillEnter', () => {
    const mockAssets: Asset[] = [
      {
        id: 'e7833d96',
        type: 'Forklift',
        name: 'Forklift FL-1',
        locationId: 'AAL',
        locationName: 'Aalborg warehouse',
        image: '',
      }, {
        id: 'ca87b865653f',
        type: 'Forklift',
        name: 'Forklift FL-2',
        locationId: 'AAL',
        locationName: 'Aalborg warehouse',
        image: 'https://cdn.pixabay.com/photo/2012/11/30/14/20/fork-68042_960_720.jpg',
      }
    ];

    // Mock the AssetService.getAll method to return mock assets
    (assetService.getAll as jasmine.Spy).and.returnValue(of(mockAssets));

    component.ionViewWillEnter();
    expect(assetService.getAll).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      expect(component.assets).toEqual(mockAssets);
      expect(component.errorMessage).toEqual('');
      expect(component.isAlertOpen).toEqual(false);
    })
  });

  it('should handle error on asset retrieval', () => { 
    const mockError = 'An Http error has occurred in the asset service while fetching the assets via get all methods';
    // Mock the AssetService.getAll method to throw an error 
    (assetService.getAll as jasmine.Spy).and.returnValue(throwError(() => new Error(mockError)));
    component.ionViewWillEnter(); 
    expect(assetService.getAll).toHaveBeenCalled(); 
    fixture.whenStable().then(() => { 
      expect(component.errorMessage).toEqual(mockError); 
      // Assert the error message 
      expect(component.assets).toEqual([]); 
      expect(component.isAlertOpen).toEqual(true); 
    }); 
  });
})

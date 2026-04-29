import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ComponentsComponent } from './pages/components/components.component';
import { StudioComponent } from './pages/studio/studio.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'studio', component: StudioComponent },
  { path: 'components', component: ComponentsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];

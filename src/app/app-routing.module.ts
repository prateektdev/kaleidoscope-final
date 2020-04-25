import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'kaleidoscope', pathMatch: 'full' },
  { path: 'kaleidoscope', loadChildren: () => import('./kaleidoscope/kaleidoscope.module').then( m => m.KaleidoscopePageModule)},
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'course', loadChildren: () => import('./course/course.module').then( m => m.CoursePageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

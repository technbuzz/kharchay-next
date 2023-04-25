import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterModule, Route } from '@angular/router';
import { featureRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(featureRoutes), RouterModule],
})
export class FeatureModule {}

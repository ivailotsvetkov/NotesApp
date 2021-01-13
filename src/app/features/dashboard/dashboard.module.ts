import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { NoteService } from './services/note.service';
@NgModule({
  declarations: [DashboardComponent, ModalComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NoteService],
  entryComponents: [ModalComponent],
})
export class DashboardModule {}
